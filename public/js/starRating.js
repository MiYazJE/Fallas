import HTTPMethods from "./httpMethods.js";

let mapContenedoresFallas = new Map();

export default class StarRating {

    constructor() {
        this.httpMethods = new HTTPMethods();
    }

    getHTML(idFalla) {
        return `
            <div idFalla="${idFalla}" class="star-rating">
                <span class="star" value="5">&#9733;</span>
                <span class="star" value="4">&#9733;</span>
                <span class="star" value="3">&#9733;</span>
                <span class="star" value="2">&#9733;</span>
                <span class="star" value="1">&#9733;</span>
            </div>
            <div class="wrap-btnEliminarPuntuacion">
                <button idFalla="${idFalla}" class="btnEliminarPuntuacion">Eliminar puntuación</button>
            </div>
        `;
    }

    /**
     * Rellenar con su respectiva puntuación a cada una de las fallas ya votadas
     */
    async rellenarPuntuacionesFallas() {

        let puntuaciones = await this.getAllData();
        puntuaciones = await puntuaciones.json();

        const fallas = document.querySelectorAll('.falla');

        // Mejorar el rendimiento gracias a los métodos has y get de la clase Map
        mapContenedoresFallas.clear();
        fallas.forEach(falla => {
            let div = falla.querySelector('.star-rating');
            mapContenedoresFallas.set(div.getAttribute('idFalla'), falla);
        })

        puntuaciones.forEach(puntuacion => {
            if (mapContenedoresFallas.has(puntuacion.idFalla)) {
                let falla = mapContenedoresFallas.get(puntuacion.idFalla);
                let stars = falla.querySelector('.star-rating').children;
                this.mostrarBotonEliminar(falla, puntuacion._id);
                this.paintStars(puntuacion.puntuacion, stars);
            }
        })

    }

    // Aplicar eventos a las puntuaciones(estrellas)
    applyEvents() {
        
        const stars = document.querySelectorAll('.star');

        stars.forEach(star => star.onclick = () => this.eventoCrearPuntuacion(star));

    }

    async eventoCrearPuntuacion(star) {

        // Get id from parent
        let idFalla = star.parentElement.getAttribute('idFalla');
            
        // Get value of puntuation
        let value = star.getAttribute('value');

        this.paintStars(value, star.parentElement.children);

        // Obtener una puntuacion a partir de una ip y un idFalla
        // Si se obtiene significa que ya existe una puntuacion
        let puntuacionFalla = await this.fallaYaVotada(idFalla);

        let jsonFalla;
        try {
             jsonFalla = await puntuacionFalla.json();
        } catch(error) {}

        if (jsonFalla) {
            await this.updatePuntuacion(jsonFalla._id, value);
        }
        else { 
            let json = await this.createPuntuacion(idFalla, value);
            if (json) {
                this.mostrarBotonEliminar(star.parentElement.parentElement);
            }
        }

    }

    mostrarBotonEliminar(contenedor) {

        let btnEliminarPuntuacion = contenedor.querySelector('.btnEliminarPuntuacion');
        btnEliminarPuntuacion.style.display = 'block';

        btnEliminarPuntuacion.onclick = this.eliminarPuntuacion;
    }

    async eliminarPuntuacion(event) {

        this.httpMethods = new HTTPMethods();

        // Obtener el idPuntuacion de una ip y un id de la falla
        let id = event.target.getAttribute('idFalla');
        let ip = await HTTPMethods.getIp();
        let data = await this.httpMethods.getPuntuaciones(ip + '/' + id);
        let json = await data.json();

        // Eliminar el objeto puntuacion desde la id
        this.httpMethods.deletePuntuacion(json._id);

        // Esconder boton eliminar Puntuacion
        let contenedor = mapContenedoresFallas.get(id);
        contenedor.querySelector('.btnEliminarPuntuacion').style.display = 'none';
    
        // Despintar las estrellas de la falla 
        let contenedorStars = contenedor.querySelector('.star-rating').children;
        for (let i = 0; i < contenedorStars.length; i++) {
            contenedorStars[i].style.color = '#95A5A6';
        }
    }

    /**
     * Colorea todas las estrellas a su izquierda del color $selected,
     * las que estan a su derecha del color $normal 
     */
    paintStars(indice, parentStars) {

        let pintar = true;
        let selected = '#F39C12';
        let normal   = '#95A5A6';

        for (let i = 4; i >= 0; i--) {
            if (pintar) {
                parentStars[i].style.color = selected;
            }
            else {
                parentStars[i].style.color = normal;
            }
            if (parentStars[i].getAttribute('value') == indice) {
                pintar = false;
            }
        }
        
    }

    async fallaYaVotada(idFalla) {

        let ip = await HTTPMethods.getIp();
        let urlGet = ip + '/' + idFalla;

        return await this.httpMethods.getPuntuaciones(urlGet);
    }

    async createPuntuacion(idFalla, points) {
        
        let puntuacion = {
            idFalla: idFalla,
            puntuacion: points,
            ip: await HTTPMethods.getIp()
        }

        return this.httpMethods.createPuntuacion(puntuacion);
    }

    async updatePuntuacion(idPuntuacion, points) {
        this.httpMethods.updatePuntuacion({puntuacion: points}, idPuntuacion);
    }

    getAllData = async () => new HTTPMethods().getPuntuaciones(await HTTPMethods.getIp());

}
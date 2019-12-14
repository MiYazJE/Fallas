import HTTPMethods from "./httpMethods.js";

export default class StarRating {

    getHTML(idFalla) {
        return `
            <div idFalla="${idFalla}" class="star-rating">
                <span class="star" value="5" href="#">&#9733;</span>
                <span class="star" value="4" href="#">&#9733;</span>
                <span class="star" value="3" href="#">&#9733;</span>
                <span class="star" value="2" href="#">&#9733;</span>
                <span class="star" value="1" href="#">&#9733;</span>
            </div>
        `;
    }

    applyEvents() {
        
        const stars = document.querySelectorAll('.star');

        stars.forEach(star => star.onclick = () => {

            // Get id from parent
            let idFalla = star.parentElement.getAttribute('idFalla');
            
            // Get value of puntuation
            let value = star.getAttribute('value');

            this.paintStars(star, star.parentElement.children);

            this.sendPuntuation(idFalla, value);
        })

    }

    /**
     * Colorea todas las estrellas a su izquierda del color $selected cuando se
     * hace click sobre una de ellas, las que estan a su derecha del color $normal 
     * @param {span estrella} star 
     * @param {contenedor de todas las estrellas(span)} parentStars 
     */
    paintStars(star, parentStars) {

        let start = false;
        let selected = '#F39C12';
        let normal   = '#95A5A6';

        for (let i = 4; i >= 0; i--) {
            if (start) {
                parentStars[i].style.color = normal;
            }
            else if (parentStars[i] === star) {
                start = true;
                parentStars[i].style.color = selected;
            }
            else {
                parentStars[i].style.color = selected;
            }
        }
        
    }

    async sendPuntuation(idFalla, points) {
        
        const httpMethods = new HTTPMethods(); 

        let puntuacion = {
            idFalla: idFalla,
            puntuacion: points,
            ip: await httpMethods.getIp()
        }

        httpMethods.sendPuntuacion(puntuacion);
    }

}
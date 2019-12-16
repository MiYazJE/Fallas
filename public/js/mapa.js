
export default class Mapa {

    constructor(idMapa) {
        this.idMapa = idMapa;
        this.crearMapa();
    }

    crearMapa() {

        this.map = L.map(this.idMapa);

        let tilerMapUrl = 'https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=FeZF25xvZUuP463NS59g';
        L.tileLayer(tilerMapUrl, {
            attribution: 'Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, Imagery © <a href="http://www.kartena.se/">Kartena</a>',
        }).addTo(this.map);

    }

    modificarCoordenadas(coordenadas, falla) {

        coordenadas = this.getWGSCoordinates(coordenadas);

        this.map.setView(coordenadas, 16);

        // Eliminar el marcador de la busqueda anterior
        if (this.marker) 
            this.map.removeLayer(this.marker);
        
        this.marker = this.setPopup(coordenadas, falla);
    }

    getWGSCoordinates(coordenadas) {
        
        // Cambiar la proyeccion de la referencia espacial 25830 a 4326
        let firstProjection  = '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs';
        let secondProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
        coordenadas = proj4(firstProjection, secondProjection, coordenadas);

        return [coordenadas[1], coordenadas[0]];
    }

    setPopup(coordenadas, falla) {  
        
        let infoFalla = `
            <div class="infoFalla">
                <h3>${falla.nombre}</h3>
                <img src="${falla.boceto}">
            </div>
        `;

        return L.marker(coordenadas).addTo(this.map)
        .bindPopup(infoFalla).openPopup();
    }

}
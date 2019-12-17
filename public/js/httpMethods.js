
export default class HTTPMethods {

    constructor() {
        this.url = window.location + 'puntuaciones/';
    }
    
    async createPuntuacion(puntuacion) {

        this.init = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(puntuacion)
        }

        this.request = new Request(this.url, this.init)

        return fetch(this.request) 
            .then(async (response) => await response.json())
            .catch(err => console.error(err))
    }

    async updatePuntuacion(puntuacion, puntuacionId) {

        this.init = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(puntuacion)
        }

        let urlPut = this.url + puntuacionId;

        this.request = new Request(urlPut, this.init);

        return fetch(this.request)
            .then(res => {
                res.json()
                    .then(json => json)
            })
            .catch(err => console.error(err))
    }

    /**
     * Recibir las puntuaciones con los parámetros pasados
     */
    async getPuntuaciones(urlGet) {

        let urlFormateada = this.url + (urlGet || '');

        return fetch(urlFormateada)
            .then(response => response)
            .catch(err => console.error(err))
    }

    static async getIp() {
        let data = await fetch('https://api6.ipify.org?format=json');
        let json = await data.json();
        return json.ip;
    }

    deletePuntuacion(idPuntuacion) {

        this.init = {
            method: 'DELETE',
        }

        let urlDelete = this.url + idPuntuacion;
        let request = new Request(urlDelete, this.init);

        fetch(request)
            .then(res => res.json())
            .then(json => json) 
            .catch(err => console.error(err))

    }

}
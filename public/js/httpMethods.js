
export default class HTTPMethods {

    constructor() {
        this.url = 'https://localhost:3030/puntuaciones/'
    }
    
    async createPuntuacion(puntuacion) {

        this.init = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(puntuacion)
        }

        this.request = new Request(this.url, this.init)

        fetch(this.request) 
            .then(async (response) => {
                if (!response.ok) {
                    let msg = await response.json();
                    throw msg.message;
                }
            })
            .catch(err => console.log(err))
    }

    async updatePuntuacion(puntuacion, idPuntuacion) {

        this.init = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(puntuacion)
        }

        let urlPut = this.url + idPuntuacion;

        this.request = new Request(urlPut, this.init);

        fetch(this.request)
            .then(async (res) => {
                let json = await res.json();
                console.log(json);
                // if (!res.ok) {
                //     let json = await res.json();
                //     throw json.message;
                // }
            })
            .catch(err => console.error(err))
    }

    /**
     * Recibir las puntuaciones con los parámetros pasados
     */
    async getPuntuaciones(urlGet) {
        
        let urlFormateada = this.url + (urlGet || '');

        return fetch(urlFormateada)
            .then(response => response.json())
    }

    static async getIp() {
        let data = await fetch('https://api6.ipify.org?format=json');
        let json = await data.json();
        return json.ip;
    }

}
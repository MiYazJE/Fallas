
export default class HTTPMethods {

    constructor() {
        this.url = 'http://localhost:3030/puntuaciones/'
    }
    
    async sendPuntuacion(puntuacion) {

        this.init = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(puntuacion)
        }

        this.request = new Request(this.url, this.init)

        let data = await fetch(this.request) 
        let json = await data.json()
        return json;
    }

    /**
     * Recibir las puntuaciones de una determinada ip
     */
    async getPuntuaciones() {
        
        let ip = await this.getIp();

        let urlGet = this.url + ip; 

        return fetch(urlGet)
            .then(response => response.json())
    }

    async getIp() {
        let data = await fetch('https://api6.ipify.org?format=json');
        let json = await data.json();
        return json.ip;
    }

}
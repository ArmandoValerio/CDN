const axios = require('axios');

class Client {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://api.cloudflare.com/client/v4', // Cambia esto a tu URL base
            
            headers: {
                Authorization: `Bearer opBrvewyicK_NbRS9iL_0-tCfzQ3MiqY5NdN2x3X`
            }
        });
    }
}

module.exports = Client;
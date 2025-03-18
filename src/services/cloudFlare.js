const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4';
const CLOUDFLARE_ACCOUNT_ID = '6749431195f4f2593ec006a76916e4e1'; // Reemplaza con tu Account ID
const CLOUDFLARE_API_TOKEN = 'opBrvewyicK_NbRS9iL_0-tCfzQ3MiqY5NdN2x3X'; // Reemplaza con tu API Token

const cloudflare = axios.create({
    baseURL: CLOUDFLARE_API_URL,
    headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

exports.uploadImage = async (imagePath) => {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    const response = await cloudflare.post(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`, formData, {
        headers: formData.getHeaders()
    });

    return response.data;
};

exports.getAllImages = async () => {
    const response = await cloudflare.get(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`);
    return response.data;
};

exports.getImage = async (imageId) => {
    const response = await cloudflare.get(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`);
    return response.data;
};

exports.deleteImage = async (imageId) => {
    const response = await cloudflare.delete(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`);
    return response.data;
};
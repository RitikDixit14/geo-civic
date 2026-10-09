// MEMBER 3 — BACKEND
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function analyzeImage(imagePath, description, latitude, longitude) {
    const aiUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('description', description || "");
    form.append('latitude', latitude.toString());
    form.append('longitude', longitude.toString());

    try {
        const response = await axios.post(`${aiUrl}/analyze`, form, {
            headers: { ...form.getHeaders() }
        });
        return response.data;
    } catch (err) {
        console.error("AI Service Error:", err.message);
        throw new Error('AI Service failed');
    }
}

module.exports = { analyzeImage };

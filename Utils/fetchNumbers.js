const axios = require("axios");

const API_URL = "http://20.244.56.144/test";

const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(`${API_URL}/${type}`, { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        console.log("Error fetching numbers:", error.message);
        return [];
    }
};

module.exports = { fetchNumbers };

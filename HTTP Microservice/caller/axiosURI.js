const axios = require('axios');

const handleResponseError = (error) => {
    if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
            throw new Error(`Status ${status}: (Not Found) Incorrect API call - ${error}`);
        } else if (data.message) {
            throw new Error(`Status ${status}: ${data.message}`);
        } else {
            throw new Error(`Status ${status}: ${data.detail}`);
        }
    } else if (error.request) {
        throw new Error(`No response received: Network Error (Couldn't connect to the server)`);
    } else {
        throw new Error(`Client error: Error setting up the request - ${error}`);
    }
};

const getAPI = async (path, token) => {
    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        const response = await axios.get(`http://20.244.56.144/test${path}`, { headers } );
        return response.data;
    } catch (error) {
        handleResponseError(error);
    }
};

module.exports = { getAPI };

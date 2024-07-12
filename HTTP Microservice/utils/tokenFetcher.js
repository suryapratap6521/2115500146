const axios = require('axios');

const tokenFetcher = async () => {
    try {
        const body = {
            "companyName": process.env.COMPANY_NAME,
            "clientID": process.env.CLIENT_ID,
            "clientSecret": process.env.CLIENT_SECRET,
            "ownerName": process.env.OWNER_NAME,
            "ownerEmail": process.env.OWNER_EMAIL,
            "rollNo": process.env.ROLL_NO
        }
        const respone = await axios.post('http://20.244.56.144/test/auth', body);
        return { token: respone.data.access_token, expiry: respone.data.expires_in };
    } catch (error) {
        res.status(500).send(`Error Fetching Auth Token: ${error}`);
    }
};

module.exports = { tokenFetcher };
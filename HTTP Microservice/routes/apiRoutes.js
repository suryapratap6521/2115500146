const express = require("express");
const router = express.Router();
const { getAPI } = require('../caller/axiosURI');
const { tokenFetcher } = require('../utils/tokenFetcher');
const { pidAdder } = require('../utils/dataAdder');

var tokenExpiry;
var token;

var products = [];

function paginator(array, currentPage) {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return array.slice(startIndex, endIndex);
}

function sortByPropertyASC(property){  
    return function(a, b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
}

function sortByPropertyDESC(property){  
    return function(a,b){  
       if(a[property] < b[property])  
          return 1;  
       else if(a[property] > b[property])  
          return -1;  
   
       return 0;  
    }  
}

router.get('/companies/:companyname/categories/:categoryname/products', async (req, res) => {
    try {
        if (!token || !tokenExpiry || tokenExpiry < Date.now()) {
            const fetchData = await tokenFetcher();
            token = fetchData.token;
            tokenExpiry = fetchData.expiry;
        }
        const { companyname, categoryname } = req.params;
        const { n, minPrice, maxPrice, rating, availability, by, sort, page } = req.query;
        const response = await getAPI(`/companies/${companyname}/categories/${categoryname}/products?top=${parseInt(n)}&minPrice=${parseInt(minPrice) || 1}&maxPrice=${parseInt(maxPrice) || 10000}`, token);
        let products = await pidAdder(response);
        
        if (!sort || sort === 'asc') products.sort(sortByPropertyASC(by || "price"));
        else products.sort(sortByPropertyDESC(by || "price"));
        
        let data = products;

        if (rating) data = data.filter(product => product.rating >= rating && product.rating <= (rating + 0.99));
        if (availability) data = data.filter(product => product.availability === availability);
        
        if (n > 10) {
            data = paginator(data, parseInt(page) || 1);
        }
        
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error}`);
    }
});

router.get('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const data = products.filter(product => product.pid === productId);
        console.log(data);
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error}`);
    }
});

module.exports = router;

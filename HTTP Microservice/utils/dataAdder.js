const { v4: uuidv4 } = require('uuid');

const pidAdder = async (products) => {
    const newProducts = await products.map(product => ({
        ...product,
        pid: uuidv4()
    }));
    return newProducts;
}

module.exports = { pidAdder };
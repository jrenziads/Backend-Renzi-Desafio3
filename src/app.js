const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = 8080; // esto lo agregue porque me parecio una mejor practica manejar el port con una variable

const productManager = new ProductManager('productos.json'); 

app.use(express.json());

app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const minPrice = parseInt(req.query.minPrice);
        const maxPrice = parseInt(req.query.maxPrice);

        let products = await productManager.getProducts();

        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }

        if (!isNaN(minPrice)) {
            products = products.filter(product => product.price >= minPrice);
        }

        if (!isNaN(maxPrice)) {
            products = products.filter(product => product.price <= maxPrice);
        }

        res.json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            res.status(404).send("El producto no existe.");
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

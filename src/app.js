import express from 'express';
import { ProductManager } from "./productManager.js"

const app = express();

const PORT = 4000;

app.use(express.urlencoded({ extended: true }))

const producto = new ProductManager('./src/products.json');

app.get(`/`, (req, res) => {
    res.send("Hola bienvenidos a la pagina de inicio de la app")
})

app.get("/productos/:id", async (req, res) => {
    const product = await producto.getElementById(parseInt(req.params.id));
    if (product) {
        res.send(product);
    } else {
        res.send("Producto no encontrado");
    }
})

app.get("/productos", async (req, res) => {
    const { categoria } = req.query
    const product = await producto.getProducts()
    if (categoria) {
        res.send(product.slice(0, limit))
    } else {
        res.send(product);
    }
})

app.get(`*`,(req, res) => {
    res.send("Error 404")
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
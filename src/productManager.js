import { promises as fs } from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        try {
            const { title, description, price, thumbnail, code, stock } = product;

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Algunos campos están vacíos, por favor complete todos los campos");
                return;
            }

            const products = await this.loadProducts();
            if (products.find(element => element.code === product.code)) {
                console.log('Ya existe este producto');
                return;
            }

            products.push(product);
            await this.saveProducts(products);
            console.log('Producto agregado exitosamente');
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }

    async getProducts() {
        try {
            const products = await this.loadProducts();
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.loadProducts();
            const product = products.find(prod => prod.id === id);

            if (product) {
                console.log(product);
                return product
            } else {
                console.log(`No existe ningún producto con el ID: ${id}`);
            }
        } catch (error) {
            console.error('Error al obtener el producto:', error);
        }
    }

    async updateProduct(id, update) {
        try {
            const products = await this.loadProducts();
            const productIndex = products.findIndex(prod => prod.id === id);

            if (productIndex !== -1) {
                const updatedProduct = { ...products[productIndex], ...update };
                products[productIndex] = updatedProduct;
                await this.saveProducts(products);
                console.log('Producto actualizado exitosamente');
            } else {
                console.log(`No existe ningún producto con el ID: ${id}`);
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.loadProducts();
            const updatedProducts = products.filter(prod => prod.id !== id);

            if (updatedProducts.length === products.length) {
                console.log(`No existe ningún producto con el ID: ${id}`);
                return;
            }

            await this.saveProducts(updatedProducts);
            console.log('Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }

    async loadProducts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async saveProducts(products) {
        const data = JSON.stringify(products, null, 2);
        await fs.writeFile(this.path, data);
    }
}

export class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = Product.incrementID();
    }

    static incrementID() {
        if (this.idIncrement) {
            this.idIncrement++;
        } else {
            this.idIncrement = 1;
        }
        return this.idIncrement;
    }
}
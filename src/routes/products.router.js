import express from 'express';
import ProductManagerMongo from '../managers/ProductManagerMongo.js';

const productsRouter = express.Router();
const productManager = new ProductManagerMongo();

// Ruta GET / - Listar productos con limit
productsRouter.get('/', async (req, res) => {
    try {
        /*
        ordenamiento por precio mayor menor o menor mayor
        limit, cantidad de paginas 
        page, pagina,
        sort: ASC | DESC
        */
        const { limit, sort, page } = req.query;
        const limitProducts = limit ?? 100;
        const currentPage = page ?? 1;

        const products = await productManager.getAll({
            limit: limitProducts,
            sort,
            currentPage,
        });

        const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;
        res.status(200).json(limitedProducts);
    } catch (error) {
        res.status(505).json({ error: 'Error al obtener productos' });
    }
});

// Ruta GET /:pid - Obtener producto por ID
productsRouter.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getById(req.params.pid);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(505).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta POST / - Crear nuevo producto
productsRouter.post('/', async (req, res) => {
    console.log('entro al formulario')
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }
        const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(505).json({ error: 'Error al crear el producto' });
    }
});

// Ruta PUT /:pid - Actualizar producto
productsRouter.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(505).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta DELETE /:pid - Eliminar producto
productsRouter.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(204).end(); // No content
    } catch (error) {
        res.status(505).json({ error: 'Error al eliminar el producto' });
    }
});

export default productsRouter;

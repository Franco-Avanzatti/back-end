import express from 'express';
import CartManagerMongo from '../managers/CartManagerMongo.js';

const router = express.Router();
const cartManager = new CartManagerMongo();

// Ruta POST / - Crear un carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(505).json({ error: 'Error al crear el carrito' });
  }
});


// Ruta GET /:cid - Obtener productos del carrito
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getById(req.params.cid);
    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(505).json({ error: 'Error al obtener el carrito' });
  }
});

// Ruta POST /:cid/product/:pid - Agregar producto al carrito
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.status(201).json(cart);
  } catch (error) {
    res.status(505).json({ error: 'Error al agregar el producto al carrito' });
  }
});

router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
    res.status(204).end(); // No content
  } catch (error) {
    res.status(505).json({ error: 'Error al eliminar el producto del carrito' });
  }
});


export default router;

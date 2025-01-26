import fs from 'fs';

class CartManager {
  constructor() {
    this.filePath = './src/data/cart.json';
  }

  // Leer todos los carritos
  async getAll() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error al leer los carritos');
    }
  }

  // Obtener un carrito por ID
  async getById(id) {
    try {
      const carts = await this.getAll();
      return carts.find(cart => cart.id === id);
    } catch (error) {
      throw new Error('Error al obtener el carrito');
    }
  }

  // Crear un nuevo carrito
  async createCart() {
    try {
      const carts = await this.getAll();
      const newCart = {
        id: Date.now().toString(), // ID generado automáticamente
        products: [],
      };
      carts.push(newCart);
      await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  // Agregar un producto a un carrito
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getAll();
      const cart = carts.find(c => c.id === cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      // Verificar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex(p => p.product === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1; // Incrementar la cantidad
      } else {
        cart.products.push({ product: productId, quantity: 1 }); // Agregar el producto
      }

      await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      throw new Error('Error al agregar el producto al carrito');
    }
  }
}

export default CartManager;

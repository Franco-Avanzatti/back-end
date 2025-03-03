import Cart from "../mongodb/schemas/Cart.js";

class CartManagerMongo {
    constructor() {
        this.collectionName = `ecommerce`;
    }

    async getAll() {
        try {
          const carritos = await Cart.find();  // Esto usa el modelo Cart para consultar la base de datos
          return carritos;
        } catch (error) {
          throw new Error('Error al leer los carritos desde MongoDB: ' + error.message);
        }
    }

    // Obtener un carrito por ID
    async getById(id) {
        try {
        // MongoDB maneja automáticamente la conversión del id a ObjectId
        const cart = await Cart.findById(id);  // Usamos findById para buscar el carrito por su _id
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
        } catch (error) {
        throw new Error('Error al obtener el carrito desde MongoDB: ' + error.message);
        }
    }

    // Crear un nuevo carrito
    async createCart() {
        try {
        // Crear un nuevo carrito (MongoDB maneja el _id automáticamente)
        const newCart = new Cart({
            products: [],  // Los productos están vacíos al principio
        });
    
        // Guardar el carrito en MongoDB
        await newCart.save();  // Guardamos el carrito en la base de datos
        
        return newCart;  // El carrito ahora tiene un _id generado automáticamente por MongoDB
        } catch (error) {
        throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            // Verifica si el carrito existe
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            // Verifica si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            
            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                cart.products[productIndex].quantity += 1;
            } else {
                // Si el producto no está, agrégalo al carrito
                cart.products.push({ product: productId, quantity: 1 });
            }
    
            await cart.save();  // Guardar el carrito actualizado
            return cart;
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito: ' + error.message);
        }
    }

   
}


export default CartManagerMongo;
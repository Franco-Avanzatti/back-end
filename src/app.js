import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/cart.router.js';
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from './routes/views.router.js';
import ProductManager from './ProductManager.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Puerto de nuestro servidor
const PORT = 8080;

// Habilitamos poder recibir json
app.use(express.json());

// Hablitamos la carpeta public
app.use(express.static("public"));

// Rutas de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/", viewsRouter);

// Websockets
const productManager = new ProductManager("./src/data/products.json");
io.on("connection", (socket)=> {
  console.log("Nuevo usuario conectado");

  socket.on ("newProduct", async(productData)=> {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit("productAdded", newProduct);
    } catch (error) {
      console.log("Error añadiendo el nuevo producto");
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
        // Eliminar el producto
        await productManager.deleteProduct(productId);
        
        // Emitir el evento 'productDeleted' a los clientes
        io.emit("productDeleted", productId);  // Notificar que el producto fue eliminado
        
        // Obtener la lista de productos actualizada
        const updatedProducts = await productManager.getAll();

        // Emitir la lista completa de productos a todos los clientes
        io.emit("productListUpdated", updatedProducts);
    } catch (error) {
        console.log("Error al eliminar el producto");
    }
});

 
});

  

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

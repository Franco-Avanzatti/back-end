import { exit } from "process";
import connect from "./connection.js";
import Product from "./schemas/Product.js";
import fs from "fs";

const loadProducts = async () => {
    const data = fs.readFileSync("./src/data/products.json");
    const products = JSON.parse(data);
    console.log('Cargando productos en la base de datos...');

    await connect();

    for (const product of products) {
        try {
            delete product.id;
            const newProduct = new Product(product);
            await newProduct.save();
        } catch (error) {
            console.log("Error al cargar un producto:", error);
        }
    }

    console.log('Productos cargados exitosamente');
    exit(0); // fuerza el cierre de la carga de datos en el terminal
};

loadProducts();

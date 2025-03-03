import express from "express";
import ProductManagerMongo from "../managers/ProductManagerMongo.js";


const viewsRouter = express.Router();
const productManager = new ProductManagerMongo("./src/data/products.json");

viewsRouter.get("/", async (req, res) => {
    try {
        /*
        ordenamiento por precio mayor menor o menor mayor
        limit, cantidad de paginas 
        page, pagina,
        sort: ASC | DESC
        */
        const { limit, sort, page } = req.query;
        const limitProducts = limit ?? 5;
        const currentPage = page ?? 1;


        const products = await productManager.getAll({
            limit: limitProducts,
            sort,
            currentPage,
        });

        console.log(products)


        res.render("home", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

})

viewsRouter.get("/realtimeproducts", async (req, res) => {
    return res.render("realTimeProducts");
});

viewsRouter.get("/carrito", (req, res) => {
    return res.render("products/cart");
});



export default viewsRouter;
import Product from "../mongodb/schemas/Product.js";

class ProductManagerMongo {
    constructor() {

    }

    async getAll({
        limit,
        sort,
        currentPage,
    } = {} /* objeto vacio por defecto */   ) {
        try {
            const optionsPaginate = {
                page: currentPage,
                limit: limit ?? 5,
                collation: {
                    locale: 'es'
                }
            }
            
            if(sort){

                // buscar como ordenar con la libreria de paginacion
                // hacer el filtro por categorias
                if(sort == 'ASC'){
                   return await Product.paginate({},optionsPaginate).sort({price: 1}) 
                }else{
                    return await Product.paginate({},optionsPaginate) 
                }
            }else {
                return await Product.paginate({},optionsPaginate)
            }

        } catch (error) {
            throw new Error('Error al leer los productos');
        }
    }

    async getById(id) {
        try {
            return Product.findById(id);
        }catch (error) {
            throw new Error('Error al obtener el producto');
        }
    }

    async addProduct(productData){
        if (!productData) {
            throw new Error('Faltan datos obligatorios');
        }

        try {
            const newProduct = new Product({...productData, status: true});
            return await newProduct.save();
        }catch (error) {
            throw new Error('Error al agregar el producto');
        }
    }

    async updateProduct(id, updatedData){
        try {
            return await Product.updateOne({
                _id: id
            }, updatedData)
        }catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(id){
        try {
            const product = await Product.findById(id)
            await product.deleteOne();
        }catch (error) {
            throw new Error('Error al eliminar el producto');
        }
    }
}

export default ProductManagerMongo;
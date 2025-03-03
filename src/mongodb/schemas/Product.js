import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

export const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number, 
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String,
});

ProductSchema.plugin(mongoosePaginate)

const Product = mongoose.model('Product', ProductSchema);

export default Product;
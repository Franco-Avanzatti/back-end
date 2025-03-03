import mongoose from "mongoose";


export const CartSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    
});

const Cart = mongoose.model(`Cart`, CartSchema);

export default Cart;
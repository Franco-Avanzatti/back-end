import mongoose from 'mongoose';

const connect = async() => {
    await mongoose.connect('mongodb+srv://coderhome:coderpass@ecommerce-cluster.lsfrm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-cluster')
}

export default connect;


import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 1000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB conectado");
    } catch (error){
        console.error("Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
};
export default connectDB;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya usuarios con el mismo nombre
        trim: true, // Elimina espacios en blanco al inicio y al final
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
    },
    fechaNacimiento: {
        type: Date,
        required: true,
    },
    balance: { // Saldo del usuario para apuestas
        type: Number,
        default: 0,
    }
}, { timestamps: true }); // timestamps agrega createdAt y updatedAt automáticamente

export default mongoose.model("User", userSchema);
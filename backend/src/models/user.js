import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,   // Evita duplicados
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: ""
    },
    premium: {
        type: Boolean,
        default: false
    },
    creditcard: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);

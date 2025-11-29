import User from "../models/user.js";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

// Controller function to create a new user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, nombre, apellidos, fechaNacimiento} = req.body;

        // Validate required fields
        if (!username || !email || !password || !nombre || !apellidos || !fechaNacimiento) {
            return res.status(400).json({
                msg: "Por favor, complete todos los campos obligatorios"
            });
        }

        //Comprobar si el usuario ya existe
        const existUser = await User.findOne({ $or: [ {username}, {email}]});
        if (existUser) {
            return res.status(400).json({
                msg: "El nombre de usuario o correo ya están en uso"
            });
        }

        //Ecriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de salting. salting es añadir datos aleatorios a la contraseña antes de hashearla para mayor seguridad
        //Crear el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            nombre,
            apellidos,
            fechaNacimiento: new Date(fechaNacimiento), //Nos aseguramos de que sea una fecha con formato YYYY-MM-DD
            balance: 0 // Saldo inicial en 0
        });
        res.status(201).json({
            msg: "Usuario registrado correctamente",
            user: await newUser.save()
        });
    }catch (err){
        res.status(500).json({
            msg: "Error al registar el usuario",
            error: err.message
        })
    }
};
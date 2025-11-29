import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const { 
            username,
            email,
            password,
            confirm_password,
            nombre,
            apellidos,
            fechaNacimiento
        } = req.body;

        // Validación
        if (!username || !email || !password || !nombre || !apellidos || !fechaNacimiento) {
            return res.status(400).send("Faltan campos obligatorios");
        }

        if (password !== confirm_password) {
            return res.status(400).send("Las contraseñas no coinciden");
        }

        // Comprobar duplicados
        const existUser = await User.findOne({ 
            $or: [ { userName: username }, { email } ] 
        });

        if (existUser) {
            return res.status(400).send("El usuario o email ya existe");
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const newUser = new User({
            userName: username,               // tu modelo usa userName
            email,
            password: hashedPassword,
            nombre,
            apellidos,
            fechaNacimiento: new Date(fechaNacimiento),
            balance: 0
        });

        await newUser.save();

        return res.redirect("/");  // Redirige correctamente

    } catch (err) {
        console.error("ERROR REAL:", err);
        return res.status(500).send("Error en el servidor");
    }
};

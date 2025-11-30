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

export const loginUser = async (req, res) => {
    try {
        const { username, password} = req.body;

        //Verificamos que hay datos
        if(!username || !password){
            return res.status(400).send("Faltan campos obligatorios");
        }

        //Buscamos el usuario
        const user = await User.findOne({ userName: username });
        if(!user){
            return res.status(400).send("Usuario o contraseña incorrectos");
        }
        //Comprobamos la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).send("Usuario o contraseña incorrectos");
        }

        req.session.user = {
            id: user._id,
            username: user.userName,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            balance: user.balance,
            fechaNacimiento: user.fechaNacimiento
        }
        return res.redirect("/");


    }catch(err){
        console.error("ERROR REAL:", err);
        return res.status(500).send("Error en el servidor");
    }
};

export const updateUser = async (req, res) => {
    try {
        // El usuario logueado
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).send("No autorizado");
        }

        const { username, nombre, apellidos, email, fechaNacimiento } = req.body;

        // Validación sencilla
        if (!username || !nombre || !apellidos || !email || !fechaNacimiento) {
            return res.status(400).send("Todos los campos son obligatorios");
        }

        // Evitar duplicación de username/email con otros usuarios
        const existUser = await User.findOne({
            _id: { $ne: sessionUser.id }, // excluye a sí mismo
            $or: [{ username }, { email }]
        });

        if (existUser) {
            return res.status(400).send("Nombre de usuario o email ya están en uso");
        }

        // Actualizar en BBDD
        const updatedUser = await User.findByIdAndUpdate(
            sessionUser.id,
            {
                username,
                nombre,
                apellidos,
                email,
                fechaNacimiento: new Date(fechaNacimiento)
            },
            { new: true }
        );

        // Actualizar también la sesión
        req.session.user = {
            id: updatedUser._id,
            username: updatedUser.username,
            nombre: updatedUser.nombre,
            apellidos: updatedUser.apellidos,
            email: updatedUser.email,
            fechaNacimiento: updatedUser.fechaNacimiento,
            balance: updatedUser.balance
        };

        return res.redirect("/account");

    } catch (err) {
        console.error(err);
        return res.status(500).send("Error al actualizar usuario");
    }
};
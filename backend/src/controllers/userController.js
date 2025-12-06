import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const {
            userName,
            email,
            password,
            confirm_password,
            nombre,
            apellidos,
            fechaNacimiento
        } = req.body;

        // Validación
        if (!userName || !email || !password || !nombre || !apellidos || !fechaNacimiento) {
            return res.status(400).send("Faltan campos obligatorios");
        }

        if (password !== confirm_password) {
            return res.status(400).send("Las contraseñas no coinciden");
        }

        // Comprobar duplicados
        const existUser = await User.findOne({
            $or: [ { userName }, { email } ]
        });

        if (existUser) {
            return res.status(400).send("El usuario o email ya existe");
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const newUser = new User({
            userName,               // tu modelo usa userName
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
        const { userName, password} = req.body;

        //Verificamos que hay datos
        if(!userName || !password){
            return res.status(400).send("Faltan campos obligatorios");
        }

        //Buscamos el usuario
        const user = await User.findOne({ userName: userName });
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
            userName: user.userName,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            balance: user.balance,
            fechaNacimiento: user.fechaNacimiento,
            avatar: user.avatar
        }
        return res.redirect("/");


    }catch(err){
        console.error("ERROR REAL:", err);
        return res.status(500).send("Error en el servidor");
    }
};

export const updateUser = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).send("No autorizado");
        }

        const { userName, nombre, apellidos, email, fechaNacimiento, avatar } = req.body;

        const updatedFields = {};

        // Solo actualizar si NO está vacío o undefined
        if (userName !== undefined && userName.trim() !== "") {
            updatedFields.userName = userName.trim();
        }

        if (nombre !== undefined && nombre.trim() !== "") {
            updatedFields.nombre = nombre.trim();
        }

        if (apellidos !== undefined && apellidos.trim() !== "") {
            updatedFields.apellidos = apellidos.trim();
        }

        if (email !== undefined && email.trim() !== "") {
            updatedFields.email = email.trim();
        }

        if (fechaNacimiento !== undefined && fechaNacimiento.trim() !== "") {
            updatedFields.fechaNacimiento = new Date(fechaNacimiento);
        }

        if (avatar !== undefined && avatar.trim() !== "") {
            updatedFields.avatar = avatar.trim();
        }

        // No permitir dejar el perfil completamente vacío
        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).send("No se envió ningún dato válido para actualizar");
        }

        // Comprobar duplicados SOLO si se cambia username o email
        if (updatedFields.userName || updatedFields.email) {
            const existUser = await User.findOne({
                _id: { $ne: sessionUser.id },
                $or: [
                    updatedFields.userName ? { userName: updatedFields.userName } : null,
                    updatedFields.email ? { email: updatedFields.email } : null
                ].filter(Boolean)
            });

            if (existUser) {
                return res.status(400).send("El nombre de usuario o email ya están en uso");
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            sessionUser.id,
            updatedFields,
            { new: true }
        );
        
        // Refrescar la sesión
        req.session.user = {
            id: updatedUser._id,
            userName: updatedUser.userName,
            nombre: updatedUser.nombre,
            apellidos: updatedUser.apellidos,
            email: updatedUser.email,
            fechaNacimiento: updatedUser.fechaNacimiento,
            balance: updatedUser.balance,
            avatar: updatedUser.avatar
        };

        req.session.save(() => {
            return res.redirect("/account");
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Error al actualizar usuario");
    }
};

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

export const addPaymentMethod = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const { cardNumber, cardholderName, cardType } = req.body;

        if (!cardNumber || !cardholderName || !cardType) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        if (!/^\d{4}$/.test(cardNumber)) { //un checkwo para validar el num de la tarjeta
            return res.status(400).json({ error: "Número de tarjeta inválido (últimos 4 dígitos)" });
        }

        const user = await User.findByIdAndUpdate(
            sessionUser.id,
            {
                $push: {
                    paymentMethods: {
                        cardNumber,
                        cardholderName,
                        cardType
                    }
                }
            },
            { new: true }
        );

        return res.json({ success: true, paymentMethods: user.paymentMethods });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al añadir método de pago" });
    }
};

export const addFunds = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const { amount } = req.body;

        if (!amount || ![10, 50, 100, 500].includes(amount)) {
            return res.status(400).json({ error: "Cantidad inválida" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            sessionUser.id,
            { $inc: { balance: amount } },
            { new: true }
        );

        // que se actulice el balanceee $$$$ dinero dinero dineroooS
        req.session.user.balance = updatedUser.balance;
        req.session.save();

        return res.json({ success: true, newBalance: updatedUser.balance });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al añadir fondos" });
    }
};

export const getPaymentMethods = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const user = await User.findById(sessionUser.id);
        return res.json({ paymentMethods: user.paymentMethods || [] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener métodos de pago" });
    }
};

export const deletePaymentMethod = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const { cardNumber } = req.body;

        const user = await User.findByIdAndUpdate(
            sessionUser.id,
            { $pull: { paymentMethods: { cardNumber } } },
            { new: true }
        );

        return res.json({ success: true, paymentMethods: user.paymentMethods });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al eliminar método de pago" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).json({ error: "No autorizado" });
        }

        // Eliminar usuario de la BD
        await User.findByIdAndDelete(sessionUser.id);

        // Cerrar sesión
        req.session.destroy(() => {
            return res.json({ success: true });
        });

    } catch (err) {
        console.error("Error eliminando usuario:", err);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

export const purchaseSubscription = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const { period } = req.body;
        if (!period || !['monthly', 'yearly'].includes(period)) {
            return res.status(400).json({ error: "Periodo inválido" });
        }

        const prices = { monthly: 15, yearly: 120 };
        const price = prices[period];

        const user = await User.findById(sessionUser.id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const now = new Date();
        if (user.subscriptionEnd && user.subscriptionEnd > now) {
            return res.status(400).json({ error: "Ya estás suscrito hasta " + user.subscriptionEnd.toISOString() });
        }

        if (user.balance < price) {
            return res.status(400).json({ error: "Fondos insuficientes" });
        }

        const startDate = new Date();
        let endDate = new Date(startDate);
        if (period === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const updatedUser = await User.findByIdAndUpdate(
            sessionUser.id,
            {
                $inc: { balance: -price },
                premium: true,
                subscriptionPlan: "Premium",
                subscriptionStart: startDate,
                subscriptionEnd: endDate
            },
            { new: true }
        );

        req.session.user.balance = updatedUser.balance;
        req.session.user.premium = updatedUser.premium;
        req.session.user.subscriptionEnd = updatedUser.subscriptionEnd;
        req.session.save();

        return res.json({
            success: true,
            newBalance: updatedUser.balance,
            subscriptionEnd: updatedUser.subscriptionEnd,
            message: `Suscripción activa hasta ${updatedUser.subscriptionEnd.toISOString()}`
        });
    } catch (err) {
        console.error("Error en purchaseSubscription:", err);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

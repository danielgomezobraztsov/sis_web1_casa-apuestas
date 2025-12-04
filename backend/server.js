import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el .env correcto dentro de /backend
dotenv.config({
    path: path.join(__dirname, ".env")
});

// Debug para confirmar que funciona
console.log("FOOTBALL_API_KEY:", process.env.FOOTBALL_API_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI);

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 4000;

// Conectar a MongoDB antes de iniciar el servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
});

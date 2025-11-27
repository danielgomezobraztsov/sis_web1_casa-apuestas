import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

//Conectar a MongoDB antes de iniciar el servidor
connectDB().then(()=>{
    app.listen(PORT,() => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
});

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir tu frontend desde /public
app.use(express.static(path.join(__dirname, "../public")));

// Ruta principal (por si entras a /)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

// Exportar app correctamente (esto soluciona el error)
export default app;

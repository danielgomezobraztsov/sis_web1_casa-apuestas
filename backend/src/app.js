
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const logger = require("morgan");

const indexRouter = require("./routes/index");
const accountRouter = require("./routes/account");
const blogRouter = require("./routes/blog");
const gabmletRouter = require("./routes/gamble");
const helpRouter = require("./routes/help");
const logMenuRouter = require("./routes/logMenu");
const resultRouter = require("./routes/result");
const settingsRouter = require("./routes/settings");
const subscriptionRouter = require("./routes/subscription");

const app = express();

// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir tu frontend desde /public
app.use(express.static(path.join(__dirname, "../public")));

//Actiivar las rutas
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/blog", blogRouter);
app.use("/gamble", gabmletRouter);
app.use("/help", helpRouter);
app.use("/logMenu", logMenuRouter);
app.use("/result", resultRouter);
app.use("/settings", settingsRouter);
app.use("/subscription", subscriptionRouter);

// Exportar app correctamente (esto soluciona el error)
export default app;

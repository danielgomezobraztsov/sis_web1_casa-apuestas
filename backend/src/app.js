
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// const logger = require("morgan");
import logger from "morgan";

import indexRouter from "./routes/index.js";
import accountRouter from "./routes/account.js";
import blogRouter from "./routes/blog.js";
import gambleRouter from "./routes/gamble.js";
import helpRouter from "./routes/help.js";
import logMenuRouter from "./routes/logMenu.js";
import resultsRouter from "./routes/results.js";
import settingsRouter from "./routes/settings.js";
import subscriptionRouter from "./routes/subscription.js";

const app = express();


// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(cors());
app.use(express.json());

// Servir tu frontend desde /public
// app.use(express.static(path.join(__dirname, "../public")));

//Actiivar las rutas
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/blog", blogRouter);
app.use("/gamble", gambleRouter);
app.use("/help", helpRouter);
app.use("/logMenu", logMenuRouter);
app.use("/results", resultsRouter);
app.use("/settings", settingsRouter);
app.use("/subscription", subscriptionRouter);

// Exportar app correctamente (esto soluciona el error)
export default app;

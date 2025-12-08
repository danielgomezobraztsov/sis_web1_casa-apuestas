import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import logger from "morgan";
import session from "express-session";
// import dotenv from "dotenv";

import indexRouter from "./routes/index.js";
import accountRouter from "./routes/account.js";
import blogRouter from "./routes/blog.js";
import gambleRouter from "./routes/gamble.js";
import helpRouter from "./routes/help.js";
import logMenuRouter from "./routes/logMenu.js";
import resultsRouter from "./routes/results.js";
import settingsRouter from "./routes/settings.js";
import subscriptionRouter from "./routes/subscription.js";
import apiUsers from "./routes/apiUsers.js";
import faqRouter from "./routes/faq.js";

const app = express();

// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config({
//     path: path.join(__dirname, "backend", ".env")
// });

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret:"secreto-super-seguro",
    resave:false,
    saveUninitialized:false,
    cookie:{ secure:false }
}));

// Servir frontend desde /public
app.use(express.static(path.join(__dirname, "../public")));

// Variables globales para vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Router activation
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/blog", blogRouter);
app.use("/gamble", gambleRouter);     // <-- /gamble/live will work here
app.use("/help", helpRouter);
app.use("/logMenu", logMenuRouter);
app.use("/results", resultsRouter);
app.use("/settings", settingsRouter);
app.use("/subscription", subscriptionRouter);
app.use("/api/users", apiUsers);
app.use("/faq", faqRouter);

export default app;

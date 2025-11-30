import { Router } from "express";
import isLogged from "../middleware/isLogged.js";
const router = Router();

router.get("/", isLogged, (req, res) => {
    res.render("account");
});

export default router;
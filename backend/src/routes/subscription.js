import { Router } from "express";
import isLogged from "../middleware/isLogged.js";

const router = Router();

router.get("/", isLogged, (req, res) => {
    res.render("subscription");
});
export default router;
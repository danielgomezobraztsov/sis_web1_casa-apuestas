import { Router } from "express";
//import isLogged from "../middleware/isLogged.js";
const router = Router();

router.get("/", (req, res) => {
    const user = req.session.user || null;
    res.render("index", { user });
});
export default router;
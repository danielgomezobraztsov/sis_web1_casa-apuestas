import { Router } from "express";
import isLogged from "../middleware/isLogged.js";
import User from "../models/user.js";

const router = Router();

router.get("/", isLogged, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render("settings", { paymentMethods: user.paymentMethods || [] });
    } catch (err) {
        console.error(err);
        res.render("settings", { paymentMethods: [] });
    }
});

export default router;
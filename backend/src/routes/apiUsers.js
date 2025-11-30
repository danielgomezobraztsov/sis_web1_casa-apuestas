import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

export default router;

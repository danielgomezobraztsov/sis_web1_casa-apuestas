import express from "express";
import { playRoulette } from "../controllers/rouletteController.js";

const router = express.Router();

router.get("/", (req, res) => {
    if (!req.session.user) return res.redirect("/loginMenu");
    res.render("roulette");
});

router.post("/play", playRoulette);

export default router;

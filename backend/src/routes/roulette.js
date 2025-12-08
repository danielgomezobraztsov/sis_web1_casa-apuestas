import express from "express";
import { playRoulette } from "../controllers/rouletteController.js";
import isLogged from "../middleware/isLogged.js";
import isSubscribed from "../middleware/isSubscribed.js";

const router = express.Router();

router.get("/", isLogged, isSubscribed, (req, res) => {
    res.render("roulette");
});

router.post("/play", isLogged, isSubscribed, playRoulette);

export default router;
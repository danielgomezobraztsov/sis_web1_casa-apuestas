import { Router } from "express";
// import isLogged from "../middleware/isLogged.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("help");
});
export default router;
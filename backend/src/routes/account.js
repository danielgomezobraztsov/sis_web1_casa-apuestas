import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    res.render("account");
});
export default router;
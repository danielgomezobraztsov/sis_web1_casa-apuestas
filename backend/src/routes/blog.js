import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    res.render("blog");
});
export default router;
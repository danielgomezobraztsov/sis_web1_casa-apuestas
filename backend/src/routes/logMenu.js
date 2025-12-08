import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    const loginError = req.session.loginError || null;
    if (req.session.loginError) delete req.session.loginError;
    res.render("logMenu", { loginError });
});
export default router;
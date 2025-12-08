import express from "express";
import { registerUser, loginUser, updateUser, addPaymentMethod, addFunds, getPaymentMethods, deletePaymentMethod, deleteUser } from "../controllers/userController.js";
import isLogged from "../middleware/isLogged.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/update", updateUser);
router.post("/add-payment-method", isLogged, addPaymentMethod);
router.post("/add-funds", isLogged, addFunds);
router.get("/payment-methods", isLogged, getPaymentMethods);
router.post("/delete-payment-method", isLogged, deletePaymentMethod);
router.post("/deleteUser", isLogged, deleteUser);

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

export default router;

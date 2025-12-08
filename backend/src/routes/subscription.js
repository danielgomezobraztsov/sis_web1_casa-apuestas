import { Router } from "express";
import isLogged from "../middleware/isLogged.js";
// import { purchaseSubscription } from "../controllers/userController.js";

const router = Router();

router.get("/", isLogged, (req, res) => {
    const user = req.session.user || null;
    let isSubscribed = false;
    let subscriptionEnd = null;
    if (user && user.subscriptionEnd) {
        subscriptionEnd = new Date(user.subscriptionEnd);
        if (subscriptionEnd > new Date()) {
            isSubscribed = true;
        }
    }
    res.render("subscription", { user, isSubscribed, subscriptionEnd });
});

// router.post("/purchase", isLogged, purchaseSubscription);

export default router;
import { Router } from "express";
import isLogged from "../middleware/isLogged.js";
import { purchaseSubscription } from "../controllers/userController.js";
import User from "../models/user.js";

const router = Router();

router.get("/", isLogged, async (req, res) => {
    try {
        const sessionUser = req.session.user || null;
        let user = null;

        if (sessionUser && sessionUser.id) {
            user = await User.findById(sessionUser.id).lean();
        }

        let isSubscribed = false;
        let subscriptionEnd = null;

        if (user && user.subscriptionEnd) {
            subscriptionEnd = new Date(user.subscriptionEnd);
            if (subscriptionEnd > new Date()) {
                isSubscribed = true;
            }
        }

        res.render("subscription", { user, isSubscribed, subscriptionEnd });
    } catch (err) {
        console.error("Error loading subscription page:", err);
        const user = req.session.user || null;
        res.render("subscription", { user, isSubscribed: false, subscriptionEnd: null });
    }
});

router.post("/purchase", isLogged, purchaseSubscription);

export default router;
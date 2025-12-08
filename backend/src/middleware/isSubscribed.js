import User from "../models/user.js";

export default async function isSubscribed(req, res, next) {
    if (!req.session.user) {
        if (req.method === "GET") return res.redirect("/logMenu");
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const user = await User.findById(req.session.user.id).lean();
        const now = new Date();

        const hasActiveSubscription =
            user &&
            (user.premium === true ||
                (user.subscriptionEnd && new Date(user.subscriptionEnd) > now));

        if (!hasActiveSubscription) {
            if (req.method === "GET") {
                return res.redirect("/subscription");
            }
            return res.status(403).json({ error: "Subscription required to access roulette" });
        }

        next();
    } catch (err) {
        console.error("isSubscribed error:", err);
        if (req.method === "GET") return res.redirect("/subscription");
        return res.status(500).json({ error: "Server error" });
    }
}
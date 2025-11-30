export default function isLogged(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/logMenu");
    }
    next();
}
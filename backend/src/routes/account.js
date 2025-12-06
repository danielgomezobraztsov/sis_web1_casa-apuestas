import { Router } from "express";
import isLogged from "../middleware/isLogged.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", isLogged, (req, res) => {
    const avatarDir = path.join(__dirname, "../../public/avatars");

    fs.readdir(avatarDir, (err, files) => {
        let avatarList = [];
        if (!err) {
            avatarList = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
        } else {
            console.error("Error reading avatar directory:", avatarDir, err);
        }

        // Render con la variable "avatars" (antes tenías "avatares")
        res.render("account", {
            avatars: avatarList
        });
    });
});

export default router;
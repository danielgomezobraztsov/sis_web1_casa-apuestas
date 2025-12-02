import { Router } from "express";
import { showLiveMatches } from "../controllers/liveController.js";

const router = Router();

router.get("/", showLiveMatches);

export default router;

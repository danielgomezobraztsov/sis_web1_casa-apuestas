import { Router } from "express";
import isLogged from "../middleware/isLogged.js";

import { showMatches } from "../controllers/matchController.js";
import { createBet } from "../controllers/betController.js";
import { showLiveMatches } from "../controllers/liveController.js";

const router = Router();


router.get("/", isLogged, showLiveMatches);

router.get("/matches", isLogged, showMatches);

router.get("/live", isLogged, showLiveMatches);

router.post("/bet", isLogged, createBet);

export default router;

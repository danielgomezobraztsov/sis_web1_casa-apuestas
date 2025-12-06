import { Router } from "express";
import isLogged from "../middleware/isLogged.js";

import { showMatches } from "../controllers/matchController.js";
import { createBet } from "../controllers/betController.js";
import { showLiveMatches } from "../controllers/liveController.js";
import { showBetPage } from "../controllers/betViewController.js";
import { matchesNotStarted } from "../controllers/matchesNotStarted.js";


const router = Router();


router.get("/", isLogged, matchesNotStarted);

router.get("/matches", isLogged, showMatches);

router.get("/live", isLogged, showLiveMatches);

router.get("/bet/:fixtureId", isLogged, showBetPage);

router.post("/bet", isLogged, createBet);

export default router;

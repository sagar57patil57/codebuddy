const express = require("express");

const ConnectorController = require("../controllers/connector");

const router = express.Router();

router.get("/problems", ConnectorController.getProblems);

router.get("/profile", ConnectorController.getProfile);

router.get("/random", ConnectorController.getRandomProblem);

module.exports = router;

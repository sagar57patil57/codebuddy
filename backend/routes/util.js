const express = require("express");
const TestController = require("../controllers/util");

const router = express.Router();

router.get("/contest/all", TestController.getContestList);
router.get("/contest", TestController.getContest);
router.post("/calendar", TestController.addToCalender);

module.exports = router;

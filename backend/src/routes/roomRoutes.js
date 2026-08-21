const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const participantController =
    require("../controllers/participantController");


router.get(
    "/recent",
    authMiddleware,
    participantController.getRecentRooms
);


module.exports = router;
const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const participantController =
    require("../controllers/participantController");

const roomController = require(
    "../controllers/roomController"
);


router.get(
    "/recent",
    authMiddleware,
    participantController.getRecentRooms
);

router.patch(
    "/:roomId",
    authMiddleware,
    roomController.updateRoomName
);


module.exports = router;
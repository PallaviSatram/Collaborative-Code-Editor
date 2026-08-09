const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createVersion,
    getRoomVersions,
    getVersion,
} = require("../controllers/codeVersionController");


// Save a version
router.post(
    "/",
    authMiddleware,
    createVersion
);


// Get all versions of a room
router.get(
    "/room/:roomId",
    authMiddleware,
    getRoomVersions
);


// Get a specific version
router.get(
    "/:versionId",
    authMiddleware,
    getVersion
);


module.exports = router;
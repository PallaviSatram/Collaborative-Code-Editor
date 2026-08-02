const express = require("express");

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/register",
    authController.register
);

router.post(
    "/login",
    authController.login
);

router.get(
    "/me",
    authMiddleware,
    (req, res) => {

        return res.status(200).json({
            success: true,
            message: "Authenticated user.",
            data: req.user,
        });

    }
);

module.exports = router;
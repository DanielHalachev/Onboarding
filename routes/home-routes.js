const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const user = require("../models/user");
const router = express.Router();

router.get("/welcome", authMiddleware, (request, response) => {
    response.json({
        message: "Welcome",
        user: {
            id: request.user.userId,
            username: request.user.username
        }
    })
});

module.exports = router;
const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");

const router = express.Router();

router.get("/welcome", authMiddleware, adminMiddleware, (request, response) => {
    response.json({
        message: "Welcome, admin"
    })
});

module.exports = router;
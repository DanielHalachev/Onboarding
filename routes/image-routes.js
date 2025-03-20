const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const { uploadImageController, deleteImageController } = require("../controllers/image-controller");

router.post(
    "/upload",
    authMiddleware,
    adminMiddleware,
    uploadMiddleware.single("image"),
    uploadImageController);

router.delete(
    "/delete/:id",
    authMiddleware,
    adminMiddleware,
    deleteImageController);

module.exports = router;
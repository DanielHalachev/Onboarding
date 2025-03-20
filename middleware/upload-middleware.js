const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (request, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
});

const checkFileFilter = (request, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("File format is not an image"));
    }
}

module.exports = multer({ storage: storage, fileFilter: checkFileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
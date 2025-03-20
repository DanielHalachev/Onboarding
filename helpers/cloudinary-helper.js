const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath);
        return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }
    } catch (error) {
        console.error(error.stack);
        throw new Error("Unsuccessful upload");
    }
}

module.exports = uploadToCloudinary;
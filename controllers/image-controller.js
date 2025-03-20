const Image = require("../models/image");
const { uploadToCloudinary } = require("../helpers/cloudinary-helper");
const cloudinary = require("../config/cloudinary")
const fs = require("fs");

const uploadImageController = async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({
                success: false,
                message: "No file is provided"
            })
        }

        const { url, publicId } = await uploadToCloudinary(request.file.path);
        const newImage = new Image({
            url, publicId, uploadedBy: request.user.userId
        });
        await newImage.save();

        // delete from local storage after saving
        fs.unlinkSync(request.file.path);

        response.status(201).json({
            success: true,
            message: "Successful upload"
        });
    } catch (error) {
        console.error(error.stack);
        response.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const fetchImagesController = async (request, response) => {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 2;
        const skip = (page - 1) * limit;

        const sortBy = request.query.sortBy || "createdAt";
        const sortOrder = request.query.sortOrder === "asc" ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);
        const sortObject = {};
        sortObject[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObject).skip(skip).limit(limit);
        if (images) {
            response.status(200).json({
                success: true,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            });
        }
    } catch (error) {
        console.error(error.stack);
        response.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteImageController = async (request, response) => {
    try {
        const imageToBeDeletedId = request.params.id;
        const userId = request.user.userId;

        const image = await Image.findById(imageToBeDeletedId);

        if (!image) {
            return response.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        if (image.uploadedBy.toString !== userId) {
            return response.status(403).json({
                success: false,
                message: "Unauthorized to delete image"
            });
        }
        await cloudinary.uploader.destroy(image.publicId);
        await Image.findByIdAndDelete(imageToBeDeletedId);
        response.status(200).json({
            success: true,
            message: "Succesful deletion of image"
        })
    } catch (error) {
        console.error(error.stack);
        response.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { uploadImageController, deleteImageController };
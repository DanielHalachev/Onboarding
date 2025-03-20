require("dotenv").config();
const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose
            .connect(process.env.CONNECTION_STRING);
        console.log("Connected to MongoDB sucessfully");
    } catch (error) {
        console.error("Cannot connect to MongoDB:", error.stack);
        process.exit(1);
    }
}

module.exports = connectToDB;
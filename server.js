require("dotenv").config()
const express = require("express");
const connectToDB = require("./database/db")
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const imageRoutes = require("./routes/image-routes");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);

connectToDB();

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Server is running");
});
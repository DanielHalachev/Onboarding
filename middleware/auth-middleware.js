const jwt = require("jsonwebtoken");

const authMiddleware = (request, response, next) => {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return response.status(401).json({
            success: false,
            message: "No token provided"
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token:", decodedToken);
        request.user = decodedToken;
        console.log("request.user:", request.user);
        next();
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = authMiddleware;
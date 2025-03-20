const isAdminUser = (request, response, next) => {
    if (request.user.role !== "admin") {
        return response.status(403).json({
            success: false,
            message: "Unauthorized"
        })
    }
    next();
}

module.exports = isAdminUser;
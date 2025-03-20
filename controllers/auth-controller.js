const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (request, response) => {
    try {
        const { username, email, password, role } = request.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return response.status(400).json({
                sucess: false,
                message: "User already exists. Please, login"
            });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save(); // similar to User.create(...)
        if (newUser) {
            return response.status(201).json({
                success: true,
                message: "Successful registration"
            })
        } else {
            return response.status(400).json({
                success: false,
                message: "Couldn't register"
            })
        }
    } catch (error) {
        console.error(error.stack);
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

const loginUser = async (request, response) => {
    try {
        const { username, password } = request.body;
        const user = await User.findOne({ username });
        if (!user) {
            return response.status(400).json({
                success: false,
                message: "Such a user doesn't exist"
            })
        }
        const matches = await bcrypt.compare(password, user.password);
        if (!matches) {
            return response.status(400).json({
                success: false,
                message: "Incorrect username or password"
            })
        }
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "45m" }
        );
        response.status(200).json({
            success: true,
            message: "Successful login",
            token
        })
    } catch (error) {
        console.error(error.stack);
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

const changePassword = async (request, response) => {
    try {
        const userId = request.user.userId;
        const { oldPassword, newPassword } = request.body;
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const passwordMatches = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatches) {
            return response.status(400).json({
                success: false,
                message: "Old password isn't correct"
            });
        }
        console.log("Fegelein")
        const salt = await bcrypt.genSalt();
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = newHashedPassword;
        await user.save();

        response.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error(error.stack);
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = { loginUser, registerUser, changePassword };
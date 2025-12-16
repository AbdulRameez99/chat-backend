import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "none",   // ✅ REQUIRED
                secure: true,       // ✅ REQUIRED (HTTPS)
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePhoto: user.profilePhoto
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", {
                httpOnly: true,
                sameSite: "none",   // ✅ REQUIRED
                secure: true,       // ✅ REQUIRED
                maxAge: 0
            })
            .json({ message: "Logged out successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/* ================= GET OTHER USERS ================= */
export const getOtherUsers = async (req, res) => {
    try {
        // ✅ CORRECT WAY
        const loggedInUserId = req.user._id;

        const otherUsers = await User.find({
            _id: { $ne: loggedInUserId }
        }).select("-password");

        return res.status(200).json(otherUsers);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

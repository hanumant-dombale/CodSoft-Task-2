import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
	try {
		const { fullname, email, phoneNumber, password, role } = req.body;

		if (!fullname || !email || !phoneNumber || !password || !role) {
			return res.status(400).json({
				message: "All fields required.",
				success: false,
			});
		}
		const file = req.file || "";
		let cloudResponse = null;
		if (file) {
			const fileUri = getDataUri(file);
			cloudResponse = await cloudinary.uploader.upload(fileUri.content);
		}

		const user = await User.findOne({ email });
		if (user) {
			return res.status(409).json({
				message: "User already exist with this email.",
				success: false,
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const createUser = await User.create({
			fullname,
			email,
			phoneNumber,
			password: hashedPassword,
			role,
			profile: {
				profilePhoto: cloudResponse?.secure_url,
			},
		});

		await createUser.save();

		return res.status(201).json({
			message: "Account created successfully.",
			success: true,
		});
	} catch (error) {
		console.log("Registration Error: ", error);
		return res.status(500).json({
			message: "Internal server error while creating user.",
			success: false,
			error: error,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password, role } = req.body;

		if (!email || !password || !role) {
			return res.status(400).json({
				message: "All fields required.",
				success: false,
			});
		}
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: "Incorrect email.",
				success: false,
			});
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(400).json({
				message: "Incorrect password.",
				success: false,
			});
		}
		if (role !== user.role) {
			return res.status(400).json({
				message: "Account doesn't exist with current role.",
				success: false,
			});
		}

		const tokenData = {
			userId: user._id,
		};
		const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
			expiresIn: "1d",
		});

		user = {
			_id: user._id,
			fullname: user.fullname,
			email: user.email,
			phoneNumber: user.phoneNumber,
			role: user.role,
			profile: user.profile,
		};

		return res
			.status(200)
			.cookie("token", token, {
				maxAge: 1 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "Strict" : "none",
				path: "/",
			})
			.json({
				message: `Welcome back ${user.fullname}. Your are login successfully.`,
				user,
				success: true,
			});
	} catch (error) {
		console.log("Login Error: ", error);
		return res.status(500).json({
			message: "Internal server error while login user.",
			success: false,
			error: error,
		});
	}
};

export const logout = async (req, res) => {
	try {
		return res
			.status(200)
			.clearCookie("token", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "Strict" : "none",
			})
			.json({
				message: "User logged out successfully.",
				success: true,
			});
	} catch (error) {
		console.log("Logout Error: ", error);
		return res.status(500).json({
			message: "Internal server error while logout user.",
			success: false,
			error: error,
		});
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { fullname, email, phoneNumber, bio, skills } = req.body;

		const file = req.file || "";
		let cloudResponse;
		if (file !== "") {
			const fileUri = getDataUri(file);
			cloudResponse = await cloudinary.uploader.upload(fileUri.content);
		}

		let skillsArray;
		if (skills) {
			skillsArray = skills.split(",");
		}
		const userId = req.id;
		let user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({
				message: "User not found.",
				success: false,
			});
		}
		if (fullname) user.fullname = fullname;
		if (email) user.email = email;
		if (phoneNumber) user.phoneNumber = phoneNumber;
		if (bio) user.profile.bio = bio;
		if (skills) user.profile.skills = skillsArray;

		if (cloudResponse) {
			user.profile.resume = cloudResponse.secure_url;
			user.profile.resumeOriginalName = file.originalname;
		}

		await user.save();

		user = {
			_id: user._id,
			fullname: user.fullname,
			email: user.email,
			phoneNumber: user.phoneNumber,
			role: user.role,
			profile: user.profile,
		};

		return res.status(200).json({
			message: "User profile updated successfully.",
			user,
			success: true,
		});
	} catch (error) {
		console.log("Update Error: ", error);
		return res.status(500).json({
			message: "Internal server error while updating user.",
			success: false,
			error: error,
		});
	}
};

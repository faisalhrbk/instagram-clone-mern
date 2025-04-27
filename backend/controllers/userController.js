import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";

export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(401).json({
				message: "Something is missing please Check",
				success: false,
			});
		}
		const user = await User.findOne({ email });
		if (user) {
			return res.status(401).json({
				message: "Try different Email",
				success: false,
			});
		}
		const hashedPassword = await bcrypt(password, 10);
		User.create({
			username,
			email,
			hashedPassword,
		});
		return res.status(201).json({
			message: "User Register Successfully",
			success: true,
		});
	} catch (err) {
		console.log(err);

		res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(401).json({
				message: "Something is missing Email or Password",
				success: false,
			});
		}
		let user = await findOne({ email });
		if (!email) {
			return res.status(401).json({
				message: "Email doesnt exist in database",
				success: false,
			});
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(401).json({
				message: "password is incorrect",
				success: false,
			});
		}

		const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: "1d",
		});
		user = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			followers: user.followers,
			following: user.following,
			posts: user.posts,
		};
		return res
			.cookie("token", token, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1 * 24 * 60 * 60 * 1000,
			})
			.status(200)
			.json({
				message: `welcome back ${user.username}`,
				success: true,
				user,
			});
	} catch (err) {
		console.log(err);

		res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

export const logout = async (_, res) => {
	try {
		return res.clearCookie("token", { httpOnly: true }).json({
			message: "Logout Successfully",
			success: true,
		});
	} catch (err) {
		console.log(err);

		res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

export const getProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		res.status(200).json({
			user,
			success: true,
		});
	} catch (err) {
		console.log(err);

		res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

export const editProfile = async (req, res) => {
	try {
		const userId = req.id;
		const { bio, gender } = req.body;
		const profilePicture = req.file;
		let cloudResponse;

		if (profilePicture) {
			const fileUri = getDataUri(profilePicture);
			
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

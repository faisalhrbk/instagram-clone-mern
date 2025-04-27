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
		const hashedPassword = await bcrypt.hash(password, 10);
		User.create({
			username,
			email,
			password: hashedPassword,
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
		let user = await User.findOne({ email });
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
			cloudResponse = await cloudinary.uploader.upload(fileUri);
		}
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				message: "user not found",
				success: false,
				user,
			});
		}
		if (bio) user.bio = bio;
		if (gender) user.gender = gender;
		if (profilePicture) user.profilePicture = cloudResponse.secure_url;
		await user.save();
		return res.status(200).json({
			message: "profile updated successfully",
			success: success,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
			"-password"
		);
		if (!suggestedUsers) {
			res.status(400).json({
				message: "currently dont have any suggested users",
			});
		}
		return res.status(200).json({
			message: " here are your suggested users",
			success: false,
			users: suggestedUsers,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

export const followOrUnfollow = async (req, res) => {
	try {
		const followKrneWala = req.id;
		const jiskoFollowKarunga = req.params.id;
		if (followKrneWala === jiskoFollowKarunga) {
			return res.status(400).json({
				message: "you cant follow/unfollow yourself",
				success: false,
			});
		}
		const user = await User.findById(followKrneWala);
		const targetUser = await User.findById(jiskoFollowKarunga);

		if (!user || !targetUser) {
			return res.status(400).json({
				message: "user not Found",
				success: false,
			});
		}
		// now to check karunga follow krna hai ya unfollow;
		const isFollowing = user.following.includes(jiskoFollowKarunga);
		if (isFollowing) {
			//unfollow logic
			await Promise.all([
				User.updateOne(
					{ _id: followKrneWala },
					{ $pull: { following: jiskoFollowKarunga } }
				),
				User.updateOne(
					{ _id: jiskoFollowKarunga },
					{ $pull: { followers: followKrneWala } }
				),
			]);
			return res.status(200).json({
				message: "unfollow Successfully",
				success: true,
			});
		} else {
			//follow logic
			await Promise.all([
				user.updateOne(
					{ _id: followKrneWala },
					{ $push: { following: jiskoFollowKarunga } }
				),
				user.updateOne(
					{ _id: jiskoFollowKarunga },
					{ $push: { followers: followKrneWala } }
				),
			]);
			return res.status(200).json({
				message: "follow Successfully",
				success: true,
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};

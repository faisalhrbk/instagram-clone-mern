import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
export const addNewPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const image = req.file;
		const authorId = req.id;
		if (!image) {
			return res.status(401).json({
				message: "image Required",
				success: false,
			});
		}
		const optimizedImageBuffer = await sharp(image.buffer)
			.resize({
				width: 800,
				height: 800,
				fit: "inside",
			})
			.toFormat("jpeg", { quality: "80" })
			.toBuffer();
		//buffer to data uri
		const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
			"base64"
		)}`;
		const cloudResponse = await cloudinary.uploader.upload(fileUri);
		const post = await Post.create({
			caption,
			image: cloudResponse.secure_url,
			author: authorId,
		});
		const user = await User.findById(authorId);
		if (user) {
			user.posts.push(post._id);
			await user.save();
		}
		await post.populate({ path: "author", select: "-password" });
		return res.status(201).json({
			message: "new post Added",
			success: true,
			post,
		});
	} catch (err) {
		return res.status(500).json({
			message: "Internal Server Error",
			success: false,
		});
	}
};
export const getAllPost = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({ path: "author", select: "username profilePicture" })
			.populate({
				path: "comments",
				sort: { createdAt: -1 },
				populate: { path: "author", select: "username profilePicture" },
			});

		return res.status(200).json({
			message: "all posts have been fetched here you goo",
			posts,
			success: true,
		});
	} catch (err) {
		return res.status(500).json({
			message: " Internal Server Error!",
			success: false,
		});
	}
};
export const getUserPosts = async (req, res) => {
	try {
		const authorId = req.id;
		const posts = await Post.find({ author: authorId })
			.sort({ createdAt: -1 })
			.populate({
				path: "author",
				select: "username, profilePicture",
			})
			.populate({
				path: "comments",
				sort: { createdAt: -1 },
				populate: {
					path: "author",
					select: "username,profilePicture",
				},
			});
		return res.status(200).json({
			message: "hey logged in user here are your all posts",
			posts,
			success: true,
		});
	} catch (err) {
		return res.status(500).json({
			message: " Internal Server Error!",
			success: false,
		});
	}
};

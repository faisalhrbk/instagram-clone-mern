import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

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
		//    console.log(err);
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
		//    console.log(err);
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
				select: "username profilePicture",
			})
			.populate({
				path: "comments",
				sort: { createdAt: -1 },
				populate: {
					path: "author",
					select: "username profilePicture",
				},
			});
		return res.status(200).json({
			message: "hey logged in user here are your all posts",
			posts,
			success: true,
		});
	} catch (err) {
		//    console.log(err);
		return res.status(500).json({
			message: " Internal Server Error!",
			success: false,
		});
	}
};

export const likePost = async (req, res) => {
	try {
		const likeKrneWalaUserKiId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res
				.status(404)
				.json({ message: "post not found", success: false });
		}
		//like logic started;
		await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
		await post.save();

		//implementing socket io for real time notification
		return res.status(200).json({
			message: "post Liked",
			success: true,
		});
	} catch (err) {
		//    console.log(err);
		return res.status(500).json({
			message: " Internal Server Error!",
			success: false,
		});
	}
};

export const disLikePost = async (req, res) => {
	try {
		const likeKrneWalaUserKiId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res
				.status(404)
				.json({ message: "post not found", success: false });
		}
		//like logic started;
		await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
		await post.save();

		//implementing socket io for real time notification
		return res.status(200).json({
			message: "post  disLiked",
			success: true,
		});
	} catch (err) {
		// console.log(err);

		return res.status(500).json({
			message: " Internal Server Error!",
			success: false,
		});
	}
};

export const addComment = async (req, res) => {
	try {
		const commentKrneWalaKiId = req.id;
		const postId = req.params.id;
		const { text } = req.body;

		if (!text) {
			return res.status(400).json({
				message: "Comment is empty",
				success: false,
			});
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				message: "Post not found",
				success: false,
			});
		}

		const comment = await Comment.create({
			text,
			author: commentKrneWalaKiId,
			post: postId,
		});

		// Populate author details
		const populatedComment = await Comment.findById(comment._id).populate({
			path: "author",
			select: "username profilePicture",
		});

		// Atomically add comment to post
		await Post.findByIdAndUpdate(postId, {
			$push: { comments: comment._id },
		});

		return res.status(201).json({
			message: "Comment added",
			success: true,
			comment: populatedComment,
		});
	} catch (err) {
		console.error("Error adding comment:", err);
		return res.status(500).json({
			message: "Internal Server Error",
			success: false,
		});
	}
};

export const getCommentsOfPost = async (req, res) => {
	try {
		const postId = req.params.id;
		if (!postId) {
			return res.status(400).json({
				message: "Invalid post ID",
				success: false,
			});
		}
		const comments = await Comment.find({ post: postId })
			.sort({ createdAt: -1 })
			.populate("author", "username profilePicture");

		return res.status(200).json({
			message: comments.length
				? "Comments fetched successfully"
				: "No comments found",
			success: true,
			comments,
		});
	} catch (err) {
		// console.log(err);
		return res.status(500).json({
			message: " internal server Error",
			success: false,
		});
	}
};

export const deletePost = async (req, res) => {
	try {
		const { id: authorId } = req;
		const { id: postId } = req.params;

		if (!postId)
			return res
				.status(404)
				.json({ message: "send a valid post Id", success: false });

		const post = await Post.findById(postId);
		if (!post || post.author.toString() !== authorId)
			return res.status(403).json({ message: "Unauthorized", success: false });

		await Post.findByIdAndDelete(postId);
		await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });

		return res
			.status(200)
			.json({ message: "Post deleted successfully", success: true });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ message: "Internal server error", success: false });
	}
};


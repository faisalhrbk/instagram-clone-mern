import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

import { Conversation, Message, User } from "../models";

export const sendMessage = async (req, res) => {
	try {
		const senderId = req.id;
		const receiverId = req.params.id;
		const { message } = req.body;

		// Validate inputs
		if (!message?.trim()) {
			return res
				.status(400)
				.json({ message: "Message cannot be empty", success: false });
		}
		if (!receiverId.match(/^[0-9a-fA-F]{24}$/)) {
			return res
				.status(400)
				.json({ message: "Invalid receiver ID", success: false });
		}

		// Check receiver exists
		const receiver = await User.findById(receiverId);
		if (!receiver) {
			return res
				.status(404)
				.json({ message: "Receiver not found", success: false });
		}

		// Find or create conversation
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Create message
		const newMessage = await Message.create({
			senderId,
			receiverId,
			message: message.trim(),
		});

		// Add message to conversation
		conversation.messages.push(newMessage._id);

		// Save both
		await Promise.all([conversation.save(), newMessage.save()]);

		// Populate sender details for response
		const populatedMessage = await Message.findById(newMessage._id).populate({
			path: "senderId",
			select: "username profilePicture",
		});

		return res.status(201).json({
			message: "Message sent successfully",
			success: true,
			newMessage: populatedMessage,
		});
	} catch (err) {
		console.error("Error sending message:", err);
		return res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
};

import { Conversation, Message } from "../models";

export const getMessage = async (req, res) => {
	try {
		const senderId = req.id;
		const receiverId = req.params.id;

		// Validate receiverId
		if (!receiverId.match(/^[0-9a-fA-F]{24}$/)) {
			return res
				.status(400)
				.json({ message: "Invalid receiver ID", success: false });
		}

		// Find conversation
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		}).populate({
			path: "messages",
			populate: {
				path: "senderId receiverId",
				select: "username profilePicture",
			},
			options: { sort: { createdAt: -1 }, limit: 50 }, // Sort and paginate
		});

		return res.status(200).json({
			success: true,
			messages: conversation ? conversation.messages : [],
		});
	} catch (error) {
		console.error("Error fetching messages:", error);
		return res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
};

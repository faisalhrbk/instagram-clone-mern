import Conversation from "../models/Conversation.js";
import { Conversation } from ".";
export const sendMessage = async (req, res) => {
	try {
		const senderId = req.id;
		const receiverId = req.params.id;
		const { message } = req.body;
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});
		//establish the conversation if not started;
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}
		const newMessage = await Message.create({
			senderId,
			receiverId,
			message,
		});
		if (newMessage) conversation.newMessage.push(newMessage._id);

		await Promise.all([conversation.save(), newMessage.save()]);
		//implementing socket io after front end is created

		return res.status(201).json({
			success: true,
			newMessage,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: "Internal Server Error!",
			success: false,
		});
	}
};

export const getMessage = async (req, res) => {
	try {
		const senderId = req.id;
		const receiverId = req.params.id;

		const conversation = await Conversation.find({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			return res.status(200).json({
				success: true,
				messages: [],
			});
		}

		return res.status(200).json({
			success: true,
			messages: conversation?.messages,
		});
	} catch (error) {
		console.error(error);
	}
};

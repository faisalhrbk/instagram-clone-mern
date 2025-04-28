import Conversation from "../models/Conversation.js";
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


	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: "Internal Server Error!",
			success: false,
		});
	}
};

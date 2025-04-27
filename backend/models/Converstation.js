import mongoose from "mongoose";
const ConversationSchema = mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		message: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{ timestamps: true }
);
export default mongoose.model("Conversation", ConversationSchema);

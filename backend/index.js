//Core Modules

// External Modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//Local Modules
import connectDB from "./utils/mongoDb.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import messageRouter from "./routes/messageRouter.js";

// Packages Config and variables
const app = express();
dotenv.config({});
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
};
app.use(cors(corsOptions));

//Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/message", messageRouter);

// Error Handling
app.use((req, res) => {
	res.status(404).json({ message: "Route not found", success: false });
});
app.use((err, req, res, next) => {
	logger.error("Server error:", err);
	res.status(500).json({ message: "Internal server error", success: false });
});

//Start Server
app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server is running on port http://localhost:${PORT}`);
});

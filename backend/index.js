//Core Modules

// External Modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//Local Modules
import connectDB from "./utils/mongoDb.js";
import userRouter from "./routes/userRouter.js";

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
app.get("/", (req, res, next) => {
	res.send("hello world");
});

app.use("/api/v1/user", userRouter);

//Start Server
app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server is running on port http://localhost:${PORT}`);
});

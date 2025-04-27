//Core Modules
// External Modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//Local Modules

//middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
};
app.use(cors(corsOptions));

//routes go here
app.get("/", (req, res, next) => {
	res.send("hello world");
});
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});

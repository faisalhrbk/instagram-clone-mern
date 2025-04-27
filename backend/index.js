//Core Modules
// External Modules
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { cors } from 'cors';
//Local Modules

//middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));



const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
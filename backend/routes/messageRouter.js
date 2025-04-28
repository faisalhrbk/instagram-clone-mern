import express from "express";
import isAuthenticated from "../middlewares/isAuth.js";

import { getMessage, sendMessage } from "../controllers/messageController.js";
const messageRouter = express.Router();

messageRouter.route("/send/:id").post(isAuthenticated, sendMessage);
messageRouter.route("/all/:id").get(isAuthenticated, getMessage);

export default messageRouter;
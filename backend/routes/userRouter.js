import express from "express";
import {
	register,
	login,
	logout,
	getProfile,
	editProfile,
	getSuggestedUsers,
	followOrUnfollow,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// Add request logging middleware
userRouter.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
	next();
});
userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/:id/profile").get(isAuthenticated, getProfile);
userRouter
	.route("/profile/edit")
	.post(isAuthenticated, upload.single("profilePicture"), editProfile);
userRouter.route("/suggested-user").get(isAuthenticated, getSuggestedUsers);
userRouter
	.route("/follow-or-unfollow/:id")
	.post(isAuthenticated, followOrUnfollow);
export default userRouter;

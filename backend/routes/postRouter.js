import express from "express";
const postRouter = express.Router();
import { isAuthenticated } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import {
	addComment,
	addNewPost,
	bookmarkPost,
	deletePost,
	disLikePost,
	getAllPost,
	getCommentsOfPost,
	getUserPosts,
	likePost,
} from "../controllers/postController.js";

postRouter
	.route("/create")
	.post(isAuthenticated, upload.single("image"), addNewPost);
postRouter.route("/all-posts").get(isAuthenticated, getAllPost);
postRouter.route("/user-posts").get(isAuthenticated, getUserPosts);
postRouter.route("/:id/like").post(isAuthenticated, likePost);
postRouter.route("/:id/dislike").post(isAuthenticated, disLikePost);
postRouter.route("/:id/comment").post(isAuthenticated, addComment);
postRouter.route("/:id/comments").post(isAuthenticated, getCommentsOfPost);
postRouter.route("/:id/delete").post(isAuthenticated, deletePost);
postRouter.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);
export default postRouter;

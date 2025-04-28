import express from "express";
import { isAuthenticated } from "../middlewares/isAuth";
import upload from "../middlewares/multer";
import {
    addComment,
	addNewPost,
	bookmarkPost,
	deletePost,
	disLikePost,
	getAllPost,
	getCommentsOfPost,
	likePost,
} from "../controllers/postController";
const postRouter = express.Router();
postRouter
	.route("/add-post")
	.post(isAuthenticated, upload.single("image"), addNewPost);
postRouter.route("/all").get(isAuthenticated, getAllPost);
postRouter.route("/user-post/all").post(isAuthenticated, getAllPost);
postRouter.route("/:id/like").post(isAuthenticated, likePost);
postRouter.route("/:id/dislike").post(isAuthenticated, disLikePost);
postRouter.route("/:id/comment").post(isAuthenticated, addComment);
postRouter.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
postRouter.route("/delete/:id").post(isAuthenticated, deletePost);

postRouter.route("/comment/bookmark").post(isAuthenticated, bookmarkPost);
export default postRouter;
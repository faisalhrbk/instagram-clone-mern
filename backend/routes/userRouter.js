import express from 'express'
import { register, login, logout, getProfile } from '../controllers/userController.js';
import  {isAuthenticated}  from '../middlewares/isAuth.js';

const router = express.Router();

 router.route('/register').post(register)
  router.route("/login").post(login);
   router.route("/logout").get(logout);
    router.route("/:id/profile").get(isAuthenticated, getProfile);
     router.route("/profile/edit").post(register);
      router.route("/register").post(register);

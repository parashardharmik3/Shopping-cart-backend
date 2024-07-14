import express from "express";
import { userController } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
export const routes = express.Router();

routes.post('/register', userController.register);
routes.post('/refresh_token', userController.refreshToken);
routes.post('/login', userController.login);
routes.get('/logout', userController.logout);
routes.get('/information',auth,userController.getUser);
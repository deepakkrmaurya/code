import { Router } from "express";
import { forGotPassword, GetUser, Login, Register, resetPassword } from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const routes = Router();    

routes.post('/register',Register)
routes.post('/login',Login)
routes.get('/me',isAuthenticated,GetUser)
routes.post('/forgot-password',forGotPassword)
routes.post('/reset-password/:token',resetPassword)

export default routes
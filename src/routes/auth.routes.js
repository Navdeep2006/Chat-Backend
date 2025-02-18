import express from 'express';
import { forgetPassword, login, logout, sendVerifyEmail, signup, verifyEmail } from '../controllers/auth.controllers.js'
import { loginSchemaChecker, signupSchemaChecker, verifyEmailChecker } from '../middlewares/zod.auth.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.post("/signup",signupSchemaChecker,signup)
router.post("/login",loginSchemaChecker,login)
router.post("/logout",logout)

router.post("/sendVerifyEmail",protectRoute,sendVerifyEmail); 
router.post("/verifyEmail",protectRoute,verifyEmailChecker,verifyEmail)
router.post("/forgetPassword",forgetPassword)

export default router;
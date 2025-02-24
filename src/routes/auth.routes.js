import express from 'express';
import { forgetPassword, login, logout, sendForgetPasswordEmail, sendVerifyEmail, signup, verifyEmail } from '../controllers/auth.controllers.js'
import { forgetPasswordChecker, loginSchemaChecker, sendForgetPasswordEmailChecker, signupSchemaChecker, verifyEmailChecker } from '../middlewares/zod.auth.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.post("/signup",signupSchemaChecker,signup);
router.post("/login",loginSchemaChecker,login);
router.get("/logout",logout);

router.get("/sendVerifyEmail",protectRoute,sendVerifyEmail); 
router.post("/verifyEmail",protectRoute,verifyEmailChecker,verifyEmail);
router.post("/sendForgetPasswordEmail",sendForgetPasswordEmailChecker,sendForgetPasswordEmail);
router.post("/forgetPassword",forgetPasswordChecker,forgetPassword);

export default router;
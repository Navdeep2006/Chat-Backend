import express from 'express';
import { forgetPassword, login, logout, signup, verifyEmail } from '../controllers/auth.controllers.js'
import { loginSchemaChecker, signupSchemaChecker } from '../middlewares/zod.auth.js';

const router = express.Router();

router.post("/signup",signupSchemaChecker,signup)
router.post("/login",loginSchemaChecker,login)
router.post("/logout",logout)
router.post("/verifyEmail",verifyEmail)
router.post("/forgetPassword",forgetPassword)

export default router;
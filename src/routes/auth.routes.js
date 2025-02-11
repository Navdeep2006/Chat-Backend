import express from 'express';
import { forgetPassword, login, logout, signup, verifyEmail } from '../controllers/auth.controllers.js'

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/verifyEmail",verifyEmail)
router.post("/forgetPassword",forgetPassword)

export default router;
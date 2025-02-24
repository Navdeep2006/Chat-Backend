import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url'
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const verifyEmailGenerator = async(code,email) => {
    let verifyTemplate = fs.readFileSync(path.join(__dirname,'./email/verifyEmail.html'),'utf8');
    verifyTemplate = verifyTemplate.replace('{{code}}',code)

    const mailOptions = {
        from : process.env.EMAIL_USER,
        to : email,
        subject: 'Your Verification Code',
        html: verifyTemplate
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

export const resetPasswordEmailGenerator = async(code,email) => {
    let verifyTemplate = fs.readFileSync(path.join(__dirname,'./email/forgetPassword.html'),'utf8');
    verifyTemplate = verifyTemplate.replace('{{code}}',code)

    const mailOptions = {
        from : process.env.EMAIL_USER,
        to : email,
        subject: 'Your Reset Password Code',
        html: verifyTemplate
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}
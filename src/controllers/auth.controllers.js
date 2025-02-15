import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import { verifyEmailGenerator } from '../libs/nodemailer.js'
import { generateToken } from '../libs/jwt.js';

export const signup = async (req,res)=>{
    const {username,email,password} = req.body;
    try {
        
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "User with this Email already exists"});

        const isUsername = await User.findOne({username});
        if(isUsername) return res.status(400).json({message: "Username is already taken"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const verificationCode = Math.floor(1000 + Math.random() * 9000);
        const verificationExpire = Date.now()+10*60*1000;

        const newUser = new User({
            name: username,
            username,
            email,
            password: hashedPassword,
            verificationCode,
            verificationExpire,
        });

        if(newUser){
            await newUser.save();

            generateToken(newUser._id,res);

            verifyEmailGenerator(newUser.verificationCode,newUser.email);

            res.status(201).json({
                _id:newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                pic: newUser.pic,
            });
        }else{
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export const login =()=>{};
export const logout =()=>{};
export const verifyEmail =()=>{};
export const forgetPassword =()=>{};
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import { resetPasswordEmailGenerator, verifyEmailGenerator } from '../libs/nodemailer.js'
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

export const login = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message:"Invalid Credentials"});

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"});

        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            pic: user.pic,
        });

    } catch (error) {
        console.log("Error is login controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const logout = async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Logged out Successfully"})
    } catch (error) {
        console.log("error in the logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const sendVerifyEmail = async(req,res) => {
    const user = req.user;
    try {
        const verificationCode = Math.floor(1000 + Math.random() * 9000);
        const verificationExpire = Date.now()+10*60*1000;

        const updatedUser = await User.findByIdAndUpdate(user._id,{verificationCode,verificationExpire},{new:true});
        if(!updatedUser) throw new Error("Database update failed");
       
        verifyEmailGenerator(updatedUser.verificationCode,updatedUser.email);

        res.status(200).json({message: "Successful"});

    } catch (error) {
        console.log("Error in sendVerifyEmail Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const verifyEmail = async(req,res)=>{
    const {code} = req.body;
    const user = req.user;
    try {
    const presentTime = Date.now();

    if(!(user.verificationExpire > presentTime)) return res.status(400).json({message: "Code has expired"});

    if(user.verificationCode!=code) return res.status(400).json({message: "Incorrect Code"});

    const updatedUser = await User.findByIdAndUpdate(user._id,{isVerified:true},{new:true});
    
    if(!updatedUser) throw new Error("Database update failed");

    res.status(200).json({message: "Successfully updated"});


    } catch (error) {
        console.log("Error in verifyEmail Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const sendForgetPasswordEmail = async(req,res)=>{
    const {email} = req.body;
    try {
        const user =await User.findOne({email});

        if(!user) res.status(400).json({message: "No User with Email Exist"});

        const resetCode = Math.floor(1000 + Math.random() * 9000);
        const resetExpire =  Date.now()+10*60*1000;

        const updatedUser =await User.findByIdAndUpdate(user._id,{resetCode,resetExpire},{new:true});

        if(!updatedUser) throw new Error("Database update failed");

        resetPasswordEmailGenerator(updatedUser.resetCode,updatedUser.email);

        res.status(200).json({message: "Successful"});

    } catch (error) {
        console.log("Error sendForgetPasswordEmail Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

};

export const forgetPassword = async(req,res)=>{
    const {email,code,password} = req.body;
    try {

        const user = await User.findOne({email});

        if(!user) res.status(400).json({message: "No User with Email Exist"});

        const presentTime = Date.now();


        if(!(user.resetExpire > presentTime)) return res.status(400).json({message: "Code has expired"});

        if(user.resetCode!=code) return res.status(400).json({message: "Incorrect Code"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        
        const updatedUser = await User.findByIdAndUpdate(user._id,{password:hashedPassword},{new:true});
    
        if(!updatedUser) throw new Error("Database update failed");

        res.status(200).json({message: "Successfully updated"});
        
    } catch (error) {
        console.log("Error in forgetPassword Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};
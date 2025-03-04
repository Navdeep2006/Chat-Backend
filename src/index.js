import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {connectDB} from './libs/db.js';

import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app = express();


const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));

app.use("/api/auth",authRoutes);

app.use((err,req,res,next) => {
    console.log("Unexpected error: ", err.message);
    res.status(500).json({message: "Internal server Error"});
})

app.listen(PORT,()=>{
    console.log("server is running on PORT:"+PORT);
    connectDB();
})
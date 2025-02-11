import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: String,
        username:{
            type: String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        pic:{
            type: String,
            default: ""
        },
        status: String,  // for future
        isVerified:{
            type: Boolean,
            default: false,
        },
        verificationCode: String,
        verificationExpire: Date,
        resetCode: String,
        resetExpire: Date,
        lastSeen: Date, //for future use
    },
    {timeseries: true}
    
)

const User = mongoose.model("User",UserSchema);

export default User;
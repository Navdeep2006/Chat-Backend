import z from 'zod';

const signupSchema = z.object({
    username: z.string().trim().min(5),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().trim().min(8)
});

export const signupSchemaChecker = (req,res,next) =>{
    let data = signupSchema.safeParse(req.body);
    if(data.success){
        req.body = data.data;
        next();
    }
    else{
        res.status(400).json({message: "Invalid user data"});
    }
}

const loginSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().trim().min(8)
})

export const loginSchemaChecker = (req,res,next) =>{
    let data = loginSchema.safeParse(req.body);
    if(data.success){
        req.body = data.data;
        next();
    }
    else{
        res.status(400).json({message: "Invalid user data"});
    }
}

const verifyEmailSchema = z.object({
    code: z.string().trim().length(4)
})

export const verifyEmailChecker = (req,res,next) =>{
    let data = verifyEmailSchema.safeParse(req.body);
    if(data.success){
        req.body = data.data;
        next();
    }
    else{
        res.status(400).json({message: "Invalid code data"});
    }
}
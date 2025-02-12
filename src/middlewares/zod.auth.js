import z from 'zod';

const signUpSchema = z.object({
    username: z.string().trim(),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().trim().min(8)
})


export const signupSchemaChecker = (req,res,next) =>{
    let data = signUpSchema.safeParse(req.body);
    if(data.success){
        req.body = data.data;
        next();
    }
    else{
        res.status(400).json({message: "incorrect Schema"});
    }
}

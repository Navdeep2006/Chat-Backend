const express = require ('express');
const dotenv = require ('dotenv');
const cookieParser = require ('cookie-parser');
const cors = require ('cors');


const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));


app.listen(PORT,()=>{
    console.log("server is running on PORT:"+PORT)
})
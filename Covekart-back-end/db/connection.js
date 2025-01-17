import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
 export const DB=()=>{
    mongoose.connect(process.env.connection_string).then(()=>{
        console.log("db connected");
    }).catch((err)=>{
        console.log(err);
    })
}
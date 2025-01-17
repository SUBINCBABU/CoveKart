import mongoose from "mongoose"

const schema=mongoose.Schema
const current_userSchema=new schema({
    id :Number,
    name:String,
    email:String,
    permissions:String,
    token:String
   
})


const  current_userModel=mongoose.model("currentUser",current_userSchema)

export default current_userModel
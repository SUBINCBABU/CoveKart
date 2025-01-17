import mongoose from "mongoose"

const schema=mongoose.Schema
const adminSchema=new schema({
   id:Number,
   name:String,
   email:String,
   password:String,
   
})


const  adminModel=mongoose.model("admin",adminSchema)

export default adminModel
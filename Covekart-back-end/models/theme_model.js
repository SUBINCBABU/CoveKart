import mongoose from "mongoose"
import { type } from "os"

const schema = mongoose.Schema
const themeschema = new schema({
    id: {type:Number},
    name:{type:String},
    slug:{type:String},
    image: {type:String},
    status: {type:Number},
    created_at: {},
    updated_at: {}
})


const themeModel = mongoose.model("themes", themeschema)

export default themeModel
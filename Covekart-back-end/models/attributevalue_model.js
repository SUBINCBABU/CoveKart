import mongoose from "mongoose"

const schema=mongoose.Schema
const attributeValueSchema=new schema({
    value: { type: String,  }, 
    slug: { type: String,  }, 
    hex_color: { type: String, default: null }, 
    created_at: { type: Date, default: Date.now }, 
    updated_at: { type: Date, default: Date.now }, 
    deleted_at: { type: Date, default: null },
    id:{type:Number ,ref:"attributes"}
   
})


const  attributeValueModel=mongoose.model("attributevalues",attributeValueSchema)

export default attributeValueModel
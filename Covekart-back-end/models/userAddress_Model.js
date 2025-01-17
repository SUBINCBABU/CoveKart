import mongoose from "mongoose"

const schema = mongoose.Schema
const usersAddressSchema = new schema({
    id: {type:Number},
    user_id: {type:Number},
    title: {type:String},
    street: {type:String},
    type: {type:String},
    city: {type:String},
    pincode: {type:Number},
    state_id: {type:Number},
    state: {type:String},
    country: {type:String},
    country_code: {type:Number},
    phone: {type:Number},
    country_id: {type:Number},
    permission:{},
    country:{},
    state:{},
    is_default: {type:Boolean},
    
})


const userAddressModel = mongoose.model("address", usersAddressSchema)

export default userAddressModel
import mongoose from "mongoose"

const schema = mongoose.Schema
const shippingRuleschema = new schema({
    id:{type:Number},
    name: { type: String },
    shipping_id: {  type: Number },
    rule_type: { type:String },
    min: { type: Number },
    max: { type:Number },
    shipping_type: { type:String },
    amount: { type: Number},
    status: { type: Boolean,default:true }

})


const shippingRuleModel = mongoose.model("Shipping Rule", shippingRuleschema)

export default shippingRuleModel
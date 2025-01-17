import mongoose from "mongoose"

const schema=mongoose.Schema
const cartSchema=new schema({

    id: {type:Number,require:true},
    product_id:  {type:Number,require:true},
    variation_id: {type:Number},
    consumer_id: {type:Number,require:true},
    quantity: {type:Number},
    sub_total: {type:Number},     
    product: {},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    deleted_at: { type: Date }
})


const  cartModel=mongoose.model("carts",cartSchema)

export default cartModel
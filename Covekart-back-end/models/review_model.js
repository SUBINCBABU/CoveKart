import mongoose from "mongoose";

const schema = mongoose.Schema

const reviewschema = new schema({
   id: { type: Number },
   product_id: { type: Number },
   store_id: { type: Number },
   review_image_id: {},
   rating: { type: Number },
   description: { type: String },
   created_at: { type: Date, required: true, default: Date.now },
   deleted_at: { type: Date, required: false },
   updated_at: { type: Date, required: false },
   review_image: { },
   consumer: {},
   consumer_id:{type:Number},
   consumer_name:{type:String},
   product:{},
   product_name:{type:String},
   store:{},
   // product_review_image: {type:String},

})

const reviewModel = mongoose.model("reviews", reviewschema)

export default reviewModel
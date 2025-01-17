import mongoose from "mongoose"

const schema = mongoose.Schema
const tagschema = new schema({

id:{
type:Number
},
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["post", "product"], 
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true, // Default to active
    },
    blogs_count: {
        type: Number,
        default: 0,
    },
    products_count: {
        type: Number,
        default: 0,
    },
    created_by_id: {
        type: mongoose.Schema.Types.ObjectId,
       
        ref: "User", // Assuming "User" is another model
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
},
    {
        timestamps: false, // Disable automatic timestamps since `created_at` and `updated_at` are handled explicitly

    })


const tagModel = mongoose.model("tags", tagschema)

export default tagModel
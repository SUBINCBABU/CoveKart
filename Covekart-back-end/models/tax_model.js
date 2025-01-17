import mongoose from "mongoose"

const schema = mongoose.Schema
const taxschema = new schema({

    id: {
        type: Number
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
    rate:{
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },

    created_by_id: {
        type: Number
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
        timestamps: false,
    })


const taxModel = mongoose.model("taxs", taxschema)

export default taxModel
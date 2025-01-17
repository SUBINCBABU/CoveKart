import mongoose from "mongoose"

const schema = mongoose.Schema
const orderStatusSchema = new schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    sequence: { type: Number, required: true },
    created_by_id: { type: Number, required: true },
    status: { type: Number, required: true },
    system_reserve: { type: Number, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: false 
  
    })


const orderStatusModel = mongoose.model("order-status", orderStatusSchema)

export default orderStatusModel
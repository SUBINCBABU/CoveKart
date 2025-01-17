import mongoose from "mongoose";

const schema = mongoose.Schema

const faqschema = new schema({
    id: { type: Number },
    title: { type: String },
    description: { type: String },
    created_by_id: { type: Number },
    status: { type: Boolean, default: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: false },
    deleted_at: { type: Date, required: false },
    
})

const faqModel = mongoose.model("faqs", faqschema)

export default faqModel
import mongoose from "mongoose";

const schema = mongoose.Schema

const pageschema = new schema({
    id: { type: Number },
    title: { type: String },
    slug: { type: String },
    content: { type: String },
    meta_title: {},
    meta_description: {},
    status: { type: Boolean, default: true },
    page_meta_image_id: { type: Number, default: null },
    created_by_id: { type: Number },
    created_at: { type: Date, required: true, default: Date.now },
    deleted_at: { type: Date, required: false },
    updated_at: { type: Date, required: false },
    page_meta_image: {},
    created_by: {},
})

const pageModel = mongoose.model("pages", pageschema)

export default pageModel
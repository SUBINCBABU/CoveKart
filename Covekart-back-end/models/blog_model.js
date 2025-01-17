import mongoose from "mongoose"

const schema=mongoose.Schema
const blogSchema=new schema({
    id: { type: Number,  unique: true },
    title: { type: String, },
    slug: { type: String,  unique: true },
    description: { type: String, },
    content: { type: String, },
    status: { type: Boolean, default: false },
    meta_title: { type: String, },
    meta_description: { type: String, },
    blog_thumbnail: { type: Object, }, // Store as an object or reference
    blog_thumbnail_id: { type: Number, },
    blog_meta_image_id: { type: Number, },
    blog_meta_image: { type: Object, }, // Store as an object or reference
    categories: {},
    tags: {},
    is_featured: { type: Boolean, default: false },
    is_sticky: { type: Boolean, default: false },
    created_by_id: { type: Number, },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    deleted_at: { type: Date },
   
})


const  blogModel=mongoose.model("productBlogs",blogSchema)

export default blogModel
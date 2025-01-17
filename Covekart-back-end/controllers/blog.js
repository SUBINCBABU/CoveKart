import blogModel from "../models/blog_model.js";
import current_user from "../controllers/admin_login.js"
import ImageModel from "../models/images_model.js";
import categoryModel from "../models/category_model.js";
import tagModel from "../models/tag_model.js";




const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {
        const lastTag = await blogModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        const existingIdTag = await blogModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

const generateSlug = async (name) => {
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const existingSlug = await blogModel.findOne({ slug });
    if (existingSlug) {
        throw new Error(`Slug already exists for name: ${name}`);
    }
    return slug;
};


export const createBlog = async (req, res) => {
    try {
        const {
            title,
            description,
            content,
            status,
            meta_title,
            meta_description,
            blog_thumbnail_id,
            blog_meta_image_id,
            categories: categoryIds,
            tags: tagIds,
            is_featured,
            is_sticky,
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }

        const numericId = await generateNumericId();
        const slug = await generateSlug(title);

        let categories = [];
        if (categoryIds && categoryIds.length > 0) {
            categories = await categoryModel.find({ id: { $in: categoryIds } });
            if (categories.length !== categoryIds.length) {
                return res.status(400).json({ message: "Some categories are invalid." });
            }
        }

        let tags = [];
        if (tagIds && tagIds.length > 0) {
            tags = await tagModel.find({ id: { $in: tagIds } });
            if (tags.length !== tagIds.length) {
                return res.status(400).json({ message: "Some tags are invalid." });
            }
        }

        let blog_meta_image = null;
        if (blog_meta_image_id) {
            blog_meta_image = await ImageModel.findOne({ id: blog_meta_image_id }).lean();

        }

        let blog_thumbnail = null;
        if (blog_thumbnail_id) {
            blog_thumbnail = await ImageModel.findOne({ id: blog_thumbnail_id }).lean();

        }


        const newBlog = new blogModel({
            id: numericId,
            title,
            slug,
            description,
            content,
            status,
            meta_title,
            meta_description,
            blog_thumbnail_id,
            blog_thumbnail,
            blog_meta_image_id,
            blog_meta_image,
            categories,
            tags,
            is_featured,
            is_sticky,
            created_by_id: current_user[0].id,
            created_at: new Date(),
            updated_at: new Date(),
        });

        const savedBlog = await newBlog.save();

        res.status(201).json({ message: "Blog created successfully", blog: savedBlog });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const getBlog = async (req, res) => {
    try {
        const allBlogs = await blogModel.find({}).lean();
        if (!allBlogs || allBlogs.length === 0) {
            return res.status(404).json({ message: "No blogs found." });
        }
        res.status(200).json({ message: "Blogs retrieved successfully", data: allBlogs });
    } catch (error) {

        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const EditBlog = async (req, res) => {
    try {
        const result = await blogModel.findOne({ id: req.params.id })
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching EditBlog:", error);
        res.status(500).json({ message: "Internal Server Error while fetching EditBlog", error: error.message });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const newSlug = req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-');
       
        const categoryIds =req.body.categories
        const newBlog_thambnail = await ImageModel.findOne({ id: req.body.blog_thumbnail_id }).lean({})
        let categories = [];
        if (categoryIds && categoryIds.length > 0) {
            categories = await categoryModel.find({ id: { $in: categoryIds } });
            if (categories.length !== categoryIds.length) {
                return res.status(400).json({ message: "Some categories are invalid." });
            }
        }

        let tags = [];
        const tagIds =req.body.tags
        if (tagIds && tagIds.length > 0) {
            tags = await tagModel.find({ id: { $in: tagIds } });
            if (tags.length !== tagIds.length) {
                return res.status(400).json({ message: "Some tags are invalid." });
            }
        }

        const blogUpdateData = {
            $set: {
                title: req.body.title,
                slug: newSlug,
                description: req.body.description,
                content: req.body.content,
                is_featured: req.body.is_featured,
                is_sticky: req.body.is_sticky,
                meta_title: req.body.meta_title,
                meta_description: req.body.meta_description,
                status: req.body.status,
                blog_thumbnail: newBlog_thambnail,
                blog_thumbnail_id: newBlog_thambnail.id,
                categories: categories,
                tags:tags
            }
        }
        const blog = await blogModel.findOneAndUpdate({ id: req.params.id },
            blogUpdateData,
            { new: true }
        ).lean({})

        res.status(200).json({
            data: blog,
            message: "Blog updated successfully",
        });
    } catch (error) {
        console.error("Error fetching updateBlog:", error);
        res.status(500).json({ message: "Internal Server Error while fetching updateBlog", error: error.message });
    }

}

export const updateBlogStatus = async (req, res) => {
    try {
        const blog = await blogModel.findOneAndUpdate({ id: req.params.id },
            { status: req.body.status },
            { new: true }
        ).lean({})
        res.status(200).json({
            data: blog,
            message: "blog Status updated successfully",
        });
    } catch (error) {
        console.error("Error fetching updateBlogStatus:", error);
        res.status(500).json({ message: "Internal Server Error while fetching updateBlogStatus", error: error.message });
    }

}


export const deleteBlog = async (req, res) => {
    try {
        await blogModel.findOneAndDelete(req.params.id).lean({})
        res.status(200).json({
            message: "blog deleted successfully",
        });
    } catch (error) {
        console.error("Error fetching deleteBlog:", error);
        res.status(500).json({ message: "Internal Server Error while fetching deleteBlog", error: error.message });
    }

}


export const deleteAllBlog = async (req, res) => {
    try {
        let ids = req.body.ids
        await blogModel.deleteMany({ id: { $in: ids } }).lean({})
        res.status(200).json({
            message: "All blog deleted successfully",
        });
    } catch (error) {
        console.error("Error fetching deleteAllBlog:", error);
        res.status(500).json({ message: "Internal Server Error while fetching deleteAllBlog", error: error.message });
    }
}
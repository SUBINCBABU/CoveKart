import ImageModel from "../models/images_model.js"
import Account from '../models/account_model.js';
import pageModel from '../models/page_model.js';
import current_user from "./admin_login.js";

const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {

        const lastTag = await pageModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        const existingIdTag = await pageModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

//getPages
export const getPages = async (req, res) => {
    try {
        const { page = 1, limit = 8, sort, filter } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = {};
        if (filter) {

        }

        const [pages, total] = await Promise.all([
            pageModel
                .find(query)
                .sort(sort || { createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            pageModel.countDocuments(query)
        ]);

        if (!pages.length) {
            return res.status(404).json({ message: "No pages found" });
        }

        res.status(200).json({
            data: pages,
            pagination: {
                message: "Pages fetched successfully",
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching pages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//createPages
export const createPages = async (req, res) => {
    let data = req.body
    const pageId = await generateNumericId();

    const user = await Account.findOne({ id: current_user[0].id }).lean({})
   
    const page_meta_image = await ImageModel.findOne({ id: req.body.page_meta_image_id }).lean({})
   
    const newSlug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-');


    const page = new pageModel({
        id: pageId,
        title: req.body.title,
        slug: newSlug,
        content: req.body.content,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        status: req.body.status,
        page_meta_image_id: req.body.page_meta_image_id,
        created_by_id: user.id,
        page_meta_image: page_meta_image,
        created_by: user,
    });
    await page.save();

    return res.status(200).json({
        message: "page added successfully",
    });

}
// editPages

export const editPages = async (req, res) => {

    const page = await pageModel.findOne({ id: req.params.id }).lean({})
    res.status(200).json({
        data: page,
        message: "Pages fetched successfully",
    });

}


export const updatePages = async (req, res) => {
   
    const newSlug = req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-');
    const pageUpdateData = {

        $set: {
            title: req.body.title,
            slug: newSlug,
            content: req.body.content,
            meta_title: req.body.meta_title,
            meta_description: req.body.meta_description,
            page_meta_image_id: req.body.page_meta_image_id,
            status: req.body.status,
        }
    }
    const page = await pageModel.findOneAndUpdate({ id: req.params.id },
        pageUpdateData,
        { new: true }
    ).lean({})
    res.status(200).json({
        data: page,
        message: "Pages updated successfully",
    });

}


export const deletePages = async (req, res) => {
   

    await pageModel.findOneAndDelete(req.params.id).lean({})
    res.status(200).json({
        message: "Page deleted successfully",
    });

}

export const deleteAllPages = async (req, res) => {
 
    let ids=req.body.ids
    await pageModel.deleteMany({ id: { $in: ids }}).lean({})
    res.status(200).json({
        message: "All Page deleted successfully",
    });
}

export const updatePageStatus=async (req,res)=>{
   
    const page = await pageModel.findOneAndUpdate({ id: req.params.id },
        {status:req.body.status},
        { new: true }
    ).lean({})
    res.status(200).json({
        data: page,
        message: "Page Status updated successfully",
    });

    
}

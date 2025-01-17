import faqModel from "../models/faq_model.js";
import current_user from "./admin_login.js";


const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {

        const lastTag = await faqModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        const existingIdTag = await faqModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const getFaqs = async (req, res) => {
    try {

        const faqs = await faqModel.find({}).lean();

        if (!faqs || faqs.length === 0) {
            return res.status(404).json({
                message: "No FAQs found",
                data: [],
            });
        }

        return res.status(200).json({
            message: "FAQs retrieved successfully",
            data: faqs,
        });
    } catch (error) {
        console.error("Error in getFaqs:", error);

        return res.status(500).json({
            error: "An error occurred while fetching the FAQs",
            details: error.message,
        });
    }
};

export const createFaqs = async (req, res) => {
    try {
        const faqData = req.body;

        const faqId = await generateNumericId();

        if (!current_user || current_user.length === 0) {
            return res.status(401).json({
                error: "Unauthorized: Current user not found",
            });
        }

        const faqs = new faqModel({
            id: faqId,
            title: faqData.title,
            description: faqData.description,
            created_by_id: current_user[0].id,
            status: faqData.status,
        });
        await faqs.save();

        return res.status(200).json({
            message: "FAQs added successfully",
        });

    } catch (error) {
        console.error("Error in createFaqs:", error);

        return res.status(500).json({
            error: "An error occurred while creating the FAQ",
            details: error.message,
        });
    }
};

export const EditFaq = async (req, res) => {
    try {
        const result = await faqModel.findOne({ id: req.params.id })
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in EditFaqs:", error);

        return res.status(500).json({
            error: "An error occurred while Edit the FAQ",
            details: error.message,
        });
    }
}

export const UpdateFaq = async (req, res) => {
    try {
        const faqUpdateData = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                created_by_id: req.body.created_by_id,
                status: req.body.status,
            }
        }
        const faq = await faqModel.findOneAndUpdate({ id: req.params.id },
            faqUpdateData,
            { new: true }
        ).lean({})
        console.log("faq---===", faq);

        res.status(200).json({
            data: faq,
            message: "FAQ updated successfully",
        });
    } catch (error) {
        console.error("Error in UpdateFaqs:", error);

        return res.status(500).json({
            error: "An error occurred while update the FAQ",
            details: error.message,
        });
    }

}


export const DeleteFaq = async (req, res) => {
    try {
        await faqModel.findOneAndDelete(req.params.id).lean({})
        res.status(200).json({
            message: "FAQ deleted successfully",
        });
    } catch (error) {
        console.error("Error in DeleteFaqs:", error);
        return res.status(500).json({
            error: "An error occurred while Delete the FAQ",
            details: error.message,
        });
    }

}

export const deleteAllFaq = async (req, res) => {
    try {
        let ids = req.body.ids
        await faqModel.deleteMany({ id: { $in: ids } }).lean({})
        res.status(200).json({
            message: "All FAQ deleted successfully",
        });
    } catch (error) {
        console.error("Error in DeleteAllFaqs:", error);
        return res.status(500).json({
            error: "An error occurred while DeleteAll the FAQ",
            details: error.message,
        });
    }
}

export const updateFaqStatus = async (req, res) => {
    try {
        const faq = await faqModel.findOneAndUpdate({ id: req.params.id },
            { status: req.body.status },
            { new: true }
        ).lean({})
        res.status(200).json({
            data: faq,
            message: "FAQ Status updated successfully",
        });
    } catch (error) {
        console.error("Error in updateFaqStatus:", error);
        return res.status(500).json({
            error: "An error occurred while UpdateFaqStatus",
            details: error.message,
        });
    }

}

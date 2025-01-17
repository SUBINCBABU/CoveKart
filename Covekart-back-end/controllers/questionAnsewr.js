import { current_user } from './user_controller.js';
import questionAnswerModel from '../models/questionAnswers_model.js';

const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {

        const lastTag = await questionAnswerModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;
        if (newId > MAX_ID) {
            newId = MIN_ID;
        }
        const existingIdTag = await questionAnswerModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }
        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const getQuestionAnswers = async (req, res) => {
    try {
        if (!current_user || current_user.length === 0 || !current_user[0].id) {
            return res.status(200).json({ error: "Current user is not defined or invalid" });
        }
        
        const questionAnswers = await questionAnswerModel.find({ product_id: req.params.slug }).lean();
        if (!questionAnswers) {
            res.status(200).json({ data: [] });
        }
        res.status(200).json({
            data: questionAnswers,
            message: "Question added successfully",

        });
    } catch (error) {
        console.error("Error fetching question answers:", error);
        res.status(500).json({ error: "An error occurred while fetching question answers" });
    }
};

export const sendQuestion = async (req, res) => {
    try {
        const newQuestionId = await generateNumericId()
        const qans = new questionAnswerModel({
            id: newQuestionId,
            question: req.body.question,
            product_id: req.body.product_id,
            consumer_id: current_user[0].id,
            answer: req.body.answer,
        })
        await qans.save()
        const result = await questionAnswerModel.find({ product_id: req.body.product_id }).lean({})
        return res.status(200).json({
            message: "Question added successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error sending question answers:", error);
        res.status(500).json({ error: "An error occurred while sending question answers" });
    }

}

export const updateQuestion = async (req, res) => {
    try {
        const questionUpdateData = {
            $set: {
                question: req.body.question,
                updated_at: new Date()
            }
        }
        const newData = await questionAnswerModel.findOneAndUpdate(
            {
                $or: [{ product_id: req.body.product_id },
                { consumer_id: current_user[0].id }]
            },
            questionUpdateData,
            { new: true }
        ).lean({})
        
        return res.status(200).json({
            message: "Question Updated successfully",
            data: newData
        })
    } catch (error) {
        console.error("Error updating question answers:", error);
        res.status(500).json({ error: "An error occurred while updating question answers" });
    }

}

export const getQuestions = async (req, res) => {
    try {
        const questionAnswers = await questionAnswerModel.find({}).lean();
        res.status(200).json({
            message: "Question added successfully",
            data: questionAnswers
        });
    } catch (error) {
        console.error("Error fetching question answers:", error);
        res.status(500).json({ error: "An error occurred while fetching question answers" });
    }
}




export const EditQuestionAnswers = async (req, res) => {
    try {
        const result = await questionAnswerModel.findOne({ id: req.params.id })
        res.status(200).json(result);
    } catch (error) {
        console.error("Error edit question answers:", error);
        res.status(500).json({ error: "An error occurred while edit question answers" });
    }
}


export const UpdateQuestionAnswers = async (req, res) => {
    try {
        const questionAnswersUpdateData = {
            $set: {
                answer: req.body.answer,
                updated_at: new Date()
            }
        }
        const questionAnswers = await questionAnswerModel.findOneAndUpdate({ id: req.params.id },
            questionAnswersUpdateData,
            { new: true }
        ).lean({})

        res.status(200).json({
            data: questionAnswers,
            message: "questionAnswer updated successfully",
        });
    } catch (error) {
        console.error("Error update question answers:", error);
        res.status(500).json({ error: "An error occurred while update question answers" });
    }
}


export const DeleteQuestionAnswers = async (req, res) => {
    try {
        await questionAnswerModel.findOneAndDelete(req.params.id).lean({})
        res.status(200).json({
            message: "blog deleted successfully",
        });
    } catch (error) {
        console.error("Error delete question answers:", error);
        res.status(500).json({ error: "An error occurred while delete question answers" });
    }
}

export const deleteAllQuestionAnswers = async (req, res) => {
    try {
        let ids = req.body.ids
        await questionAnswerModel.deleteMany({ id: { $in: ids } }).lean({})
        res.status(200).json({
            message: "All QuestionAnswers deleted successfully",
        });
    } catch (error) {
        console.error("Error deleteAll question answers:", error);
        res.status(500).json({ error: "An error occurred while deleteAll question answers" });
    }
}

export const sendFeedback = async (req, res) => {
    try {
        const question_and_answer_id = req.body.question_and_answer_id
        const newReaction = req.body.reaction
        const current_user_id = current_user[0].id;
        let feedback
        if (current_user_id) {
            feedback = await questionAnswerModel.findOne({
                id: question_and_answer_id,
                consumer_id: current_user[0].id,
            }).lean();

            if (!feedback) {
                return res.status(404).json({ message: "Feedback entry not found" });
            }
        }
        else {
            return res.status(404).json({ message: "can not found user" });
        }
        const currentReaction = feedback.reaction;
        const update = {};
        if (currentReaction === newReaction) {

            update.reaction = null;
            if (newReaction === 'liked') {
                update.total_likes = feedback.total_likes - 1;
            } else if (newReaction === 'disliked') {
                update.total_dislikes = feedback.total_dislikes - 1;
            }
        } else {
            update.reaction = newReaction;
            if (currentReaction === 'liked') {
                update.total_likes = feedback.total_likes - 1;
            } else if (currentReaction === 'disliked') {
                update.total_dislikes = feedback.total_dislikes - 1;
            }

            if (newReaction === 'liked') {
                update.total_likes = (update.total_likes || feedback.total_likes) + 1;
            } else if (newReaction === 'disliked') {
                update.total_dislikes = (update.total_dislikes || feedback.total_dislikes) + 1;
            }
        }
        await questionAnswerModel.findOneAndUpdate(
            {
                id: question_and_answer_id,
                consumer_id: current_user_id,
            },
            { $set: update },
            { new: true }
        );

        res.status(200).json({
            message: "Feedback updated successfully",
        });
    } catch (error) {
        console.error("Error in sendFeedback:", error);
        res.status(500).json({
            message: "Failed to send feedback",
            error: error.message,
        });
    }
};

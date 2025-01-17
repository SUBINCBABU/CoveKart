import mongoose from "mongoose";

const schema = mongoose.Schema

const questionAnswerschema = new schema({
    id: { type: Number },
    answer: { type: String},
    product_id: { type: Number },
    reaction: { type: String, default: null },
    question: { type: String },
    consumer_id: { type: Number },
    total_likes: { type: Number, default: 0 },
    total_dislikes: { type: Number, default: 0 },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: false },
    deleted_at: { type: Date, required: false },
})

const questionAnswerModel = mongoose.model("QuestionAnswers", questionAnswerschema)

export default questionAnswerModel



// import mongoose from "mongoose";

// const imageSchema = new mongoose.Schema({
//     id: {
//         type: Number,
//         required: true
//     },
//     fieldname: {
//         type: String,
//         required: true,
//     },
//     originalname: {
//         type: String,
//         required: true,
//     },
//     encoding: {
//         type: String,
//         required: true,
//     },
//     mimetype: {
//         type: String,
//         required: true,
//     },
//     buffer: {
//         type: Buffer,
//         required: true,
//     },
//     size: {
//         type: Number,
//         required: true,
//     }
// }, { 
//     timestamps: true,
//     id: false, // Disable auto-generated ObjectId
//     versionKey: false,
//     toJSON: {
//         transform: function(doc, ret) {
//             ret.id = ret.id;
//             delete ret.id;
//             if (ret.buffer) {
//                 ret.buffer = ret.buffer.toString('base64');
//             }
//             return ret;
//         }
//     }
// });

// // Index for faster queries
// imageSchema.index({ createdAt: -1 });
// imageSchema.index({ id: 1 }, { unique: true });

// const ImageModel = mongoose.model("Image", imageSchema);

// export default ImageModel;







import mongoose from "mongoose";
import { type } from "os";

const imageSchema = new mongoose.Schema({
        id:{type:Number},
        collection_name: { type: String },
        name: { type: String },
        file_name: { type: String },
        mime_type: { type: String },
        disk: { type: String },
        conversions_disk: { type: String },
        size: { type: Number }, 
        created_by_id: { }, 
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        original_url: { type: String, required: true }
      },
      {
        timestamps: true, 
      }
    );
const ImageModel = mongoose.model("Image", imageSchema);

export default ImageModel;
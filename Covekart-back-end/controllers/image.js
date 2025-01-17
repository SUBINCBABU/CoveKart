// import imageModel from "../models/images_model.js";
// import path from "path";
// import { fileURLToPath } from "url";


// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const generateNumericId = () => {
//     return parseInt(Date.now().toString().slice(-10) + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
// };

// export const postCreateImages = async (req, res) => {
//     try {

//         if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No files uploaded"
//             });
//         }



//         const filePromises = req.files.map(async (file) => {
//             try {
//                 const numericId = generateNumericId();
//                 const newFile = new imageModel({
//                     id: numericId,
//                     fieldname: file.fieldname,
//                     originalname: file.originalname,
//                     encoding: file.encoding,
//                     mimetype: file.mimetype,
//                     buffer: file.buffer,
//                     size: file.size
//                 });

//                 const savedFile = await newFile.save();

//                 return {
//                     id: savedFile.id,
//                     fieldname: savedFile.fieldname,
//                     originalname: savedFile.originalname,
//                     size: savedFile.size,
//                     mimetype: savedFile.mimetype,
//                     createdAt: savedFile.createdAt
//                 };
//             } catch (error) {
//                 throw new Error(`Error processing file ${file.originalname}: ${error.message}`);
//             }
//         });

//         // Wait for all files to be processed
//         const processedFiles = await Promise.all(filePromises);

//         return res.status(200).json({
//             success: true,
//             message: "Files uploaded successfully and saved to database",
//             files: processedFiles
//         });

//     } catch (error) {
//         console.error("Error uploading files:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to upload files",
//             error: error.message
//         });
//     }
// };

// export const getImages = async (req, res) => {
//     try {
//         const images = await imageModel.find()
//             .sort({ createdAt: -1 })
//             .lean();

//         if (!images || images.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No images found'
//             });
//         }
//         const transformedImages = images.map(image => ({
//             id: image.id,
//             fieldname: image.fieldname,
//             originalname: image.originalname,
//             encoding: image.encoding,
//             mimetype: image.mimetype,
//             size: image.size,
//             createdAt: image.createdAt,
//             updatedAt: image.updatedAt,
//             buffer: image.buffer.toString('base64')
//         }));

//         return res.status(200).json({
//             success: true,
//             data: transformedImages,
//             total: images.length
//         });

//     } catch (error) {
//         console.error('Error fetching images:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve images',
//             error: error.message
//         });
//     }
// };

// // Add a function to get a single image by ID
// // export const getImageById = async (req, res) => {
// //     try {
// //         const imageId = parseInt(req.params.id);
// //         const image = await imageModel.findById(imageId).lean();

// //         if (!image) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: 'Image not found'
// //             });
// //         }

// //         return res.status(200).json({
// //             success: true,
// //             data: {
// //                 id: image._id,
// //                 fieldname: image.fieldname,
// //                 originalname: image.originalname,
// //                 encoding: image.encoding,
// //                 mimetype: image.mimetype,
// //                 size: image.size,
// //                 createdAt: image.createdAt,
// //                 updatedAt: image.updatedAt,
// //                 buffer: image.buffer.toString('base64')
// //             }
// //         });

// //     } catch (error) {
// //         console.error('Error fetching image:', error);
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Failed to retrieve image',
// //             error: error.message
// //         });
// //     }
// // };


// export const deleteImage = async (req, res) => {
//     const imageId = req.params.id;
//     if (!imageId) {
//         return res.status(400).json({ message: 'Image ID is required.' });
//     }

//     try {

//         const image = await imageModel.findOne({ id: imageId });

//         if (!image) {
//             return res.status(404).json({ message: 'Image not found.' });
//         }
//         await imageModel.findOneAndDelete({ id: imageId });
//         return res.status(200).json({ message: 'Image deleted successfully.' });
//     } catch (error) {
//         console.error('Error deleting image:', error);
//         return res.status(500).json({ message: 'An error occurred while deleting the image.' });
//     }
// };


// export const deleteImages = async (req, res) => {
//     try {
//         const { ids } = req.body;

//         if (!Array.isArray(ids) || ids.length === 0) {
//             return res.status(400).json({ message: 'No valid IDs provided. Please provide an array of IDs.' });
//         }

//         const validIds = ids.filter(id => typeof id === 'number' || typeof id === 'string');

//         if (validIds.length === 0) {
//             return res.status(400).json({ message: 'All provided IDs are invalid.' });
//         }

//         const result = await imageModel.deleteMany({ id: { $in: validIds } });

//         return res.status(200).json({
//             message: `${result.deletedCount} images successfully deleted.`,
//         });
//     } catch (error) {

//         console.error('Error in deleteImages:', error);
//         return res.status(500).json({ message: 'An error occurred while deleting images.', error: error.message });
//     }
// };







//------Cloudinary---------



// import imageModel from "../models/images_model.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import { cloudinaryUpload } from "../connection/cloudinary.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const generateNumericId = () => {
//     return parseInt(Date.now().toString().slice(-10) + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
// };

// export const postCreateImages = async (req, res) => {
//     try {
//               console.log(req.files);
              
//         if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No files uploaded"
//             });
//         }


//         const uploadResult = await cloudinaryUpload.uploader
//         .upload(
//           req.file.path, {
//                 public_id: "upload/images",
//             }
//         ).then((data)=>{
//           return data
//         })
//         .catch((error) => {
//             console.log(error);
//         });

        

//         const filePromises = req.files.map(async (file) => {
//             try {
//                 const numericId = generateNumericId();
//                 const newFile = new imageModel({
//                     id: numericId,
//                     fieldname: file.fieldname,
//                     originalname: file.originalname,
//                     encoding: file.encoding,
//                     mimetype: file.mimetype,
//                     buffer: file.buffer,
//                     size: file.size
//                 });

//                // const savedFile = await newFile.save();

//                 return {
//                     id: savedFile.id,
//                     fieldname: savedFile.fieldname,
//                     originalname: savedFile.originalname,
//                     size: savedFile.size,
//                     mimetype: savedFile.mimetype,
//                     createdAt: savedFile.createdAt
//                 };
//             } catch (error) {
//                 throw new Error(`Error processing file ${file.originalname}: ${error.message}`);
//             }
//         });

//         // Wait for all files to be processed
//         const processedFiles = await Promise.all(filePromises);

//         return res.status(200).json({
//             success: true,
//             message: "Files uploaded successfully and saved to database",
//             files: processedFiles
//         });

//     } catch (error) {
//         console.error("Error uploading files:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to upload files",
//             error: error.message
//         });
//     }
// };


import imageModel from "../models/images_model.js";
import path from "path";
import { fileURLToPath } from "url";
import { cloudinaryUpload } from "../connection/cloudinary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {
        // Find the last tag and increment the ID
        const lastTag = await imageModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        // Reset to MIN_ID if we've reached MAX_ID
        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        // Ensure the new ID is unique
        const existingIdTag = await imageModel.findOne({ id: newId });
        if (existingIdTag) {
            // Recursively generate a new ID if collision occurs
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const postCreateImages = async (req, res) => {
    try {
        // Validate file upload
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }
        const newAttachments = [];
        for (const file of req.files) {
            try {
                const uploadResult = await cloudinaryUpload.uploader.upload(file.path, {
                    folder: "upload/images",
                });

                // Generate a unique ID
                const numericId = await generateNumericId();

                // Create a new image document
                const newFile = new imageModel({
                    id: numericId,
                    name: file.filename || file.originalname,
                    file_name: file.fieldname,
                    originalname: file.originalname,
                    disk: "public",
                    conversions_disk: "public",
                    encoding: file.encoding,
                    mime_type: file.mimetype,
                    size: file.size,
                    collection_name: "attachment",
                    original_filename: uploadResult.original_filename,
                    original_url: uploadResult.secure_url,
                    cloudinaryPublicId: uploadResult.public_id,
                });

                // Save to the database
                const savedFile = await newFile.save();
                newAttachments.push({
                    id: savedFile.id,
                    name: savedFile.name,
                    originalname: savedFile.originalname,
                    size: savedFile.size,     
                    mime_type: savedFile.mime_type,
                    original_url: savedFile.original_url,
                    createdAt: savedFile.createdAt,
                });
            } catch (fileError) {
                console.error(`Error processing file ${file.originalname}:`, fileError);
                throw new Error(`Failed to process file ${file.originalname}: ${fileError.message}`);
            }
        }

        return res.status(200).json({data:newAttachments});
    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload files",
            error: error.message,
        });
    }
};

export const getImages = async (req, res) => {
    try {
        
        const images = await imageModel.find()
            .sort({ createdAt: -1 })
            .lean();

        // Check if any images exist
        if (!images || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No images found",
            });
        }

        // Transform images for response
        const transformedImages = images.map(image => ({
            id: image.id,
            fieldname: image.fieldname,
            originalname: image.originalname,
            encoding: image.encoding,
            mime_type: image.mime_type,
            size: image.size,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt,
            original_url: image.original_url,
            buffer: image.buffer ? image.buffer.toString("base64") : null,
        }));

        return res.status(200).json({
            success: true,
            data: transformedImages,
            total: images.length,
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve images",
            error: error.message,
        });
    }
};


// Add a function to get a single image by ID
// export const getImageById = async (req, res) => {
//     try {
//         const imageId = parseInt(req.params.id);
//         const image = await imageModel.findById(imageId).lean();

//         if (!image) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Image not found'
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: {
//                 id: image._id,
//                 fieldname: image.fieldname,
//                 originalname: image.originalname,
//                 encoding: image.encoding,
//                 mimetype: image.mimetype,
//                 size: image.size,
//                 createdAt: image.createdAt,
//                 updatedAt: image.updatedAt,
//                 buffer: image.buffer.toString('base64')
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching image:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve image',
//             error: error.message
//         });
//     }
// };


export const deleteImage = async (req, res) => {
    const imageId = req.params.id;
    if (!imageId) {
       
        return res.status(400).json({ message: 'Image ID is required.' });
    }

    try {

        const image = await imageModel.findOne({ id: imageId });

        if (!image) {
           
            return res.status(404).json({ message: 'Image not found.' });
        }
        await imageModel.findOneAndDelete({ id: imageId });
        return res.status(200).json({ message: 'Image deleted successfully.' });
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the image.' });
    }
};


export const deleteImages = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No valid IDs provided. Please provide an array of IDs.' });
        }

        const validIds = ids.filter(id => typeof id === 'number' || typeof id === 'string');

        if (validIds.length === 0) {
            return res.status(400).json({ message: 'All provided IDs are invalid.' });
        }

        const result = await imageModel.deleteMany({ id: { $in: validIds } });

        return res.status(200).json({
            message: `${result.deletedCount} images successfully deleted.`,
        });
    } catch (error) {

        console.error('Error in deleteImages:', error);
        return res.status(500).json({ message: 'An error occurred while deleting images.', error: error.message });
    }
};





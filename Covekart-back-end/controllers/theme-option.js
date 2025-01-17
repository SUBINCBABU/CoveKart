import themeOptionModel from "../models/theme-option_model.js"
import ImageModel from "../models/images_model.js";


export const createThemeOption = async (req, res) => {
    try {
        const configData = new themeOptionModel(req.body);
        await configData.save();
        res.status(201).json({ message: 'Configuration saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while saving the configuration.', error });
    }
};



export const getThemeOption = async (req, res) => {
    
    const themeOption = await themeOptionModel.find({}).lean()
    const result = themeOption[0]


    res.status(201).json(result)

}





export const updateThemeOption = async (req, res) => {
    try {
        const { id, options } = req.body;
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Theme ID is required" 
            });
        }

        if (!options || Object.keys(options).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "No options provided for update" 
            });
        }

        // Create update object with dot notation for nested fields
        const updateFields = {};

        // Helper function to handle image data
        const processImageField = async (imageId, fieldPath) => {
            if (imageId) {
                const image = await ImageModel.findOne({ id: imageId });
                if (image) {
                    updateFields[fieldPath] = {
                        id: image.id,
                        collection_name: image.collection_name,
                        name: image.name,
                        file_name: image.file_name,
                        mime_type: image.mime_type,
                        disk: image.disk,
                        conversions_disk: image.conversions_disk,
                        size: image.size,
                        created_by_id: image.created_by_id,
                        created_at: image.created_at,
                        updated_at: image.updated_at,
                        original_url: image.original_url
                    };
                }
            }
        };

        // Process images if present in options
        const processImages = async () => {
            if (options.logo) {
                if (options.logo.header_logo_id) {
                    await processImageField(options.logo.header_logo_id, 'options.logo.header_logo');
                    updateFields['options.logo.header_logo_id'] = options.logo.header_logo_id;
                }
                if (options.logo.footer_logo_id) {
                    await processImageField(options.logo.footer_logo_id, 'options.logo.footer_logo');
                    updateFields['options.logo.footer_logo_id'] = options.logo.footer_logo_id;
                }
                if (options.logo.favicon_icon_id) {
                    await processImageField(options.logo.favicon_icon_id, 'options.logo.favicon_icon');
                    updateFields['options.logo.favicon_icon_id'] = options.logo.favicon_icon_id;
                }
            }

            if (options.seo && options.seo.og_image_id) {
                await processImageField(options.seo.og_image_id, 'options.seo.og_image');
                updateFields['options.seo.og_image_id'] = options.seo.og_image_id;
            }
        };

        // Helper function to flatten nested objects into dot notation
        const flattenObject = (obj, prefix = '') => {
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                const newPrefix = prefix ? `${prefix}.${key}` : `options.${key}`;
                
                // Skip image fields as they're handled separately
                if (key.endsWith('_logo_id') || key === 'favicon_icon_id' || key === 'og_image_id') {
                    return;
                }
                
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    flattenObject(value, newPrefix);
                } else if (value !== undefined && value !== null) {
                    updateFields[newPrefix] = value;
                }
            });
        };

        // Handle special nested array fields
        const handleArrayFields = (options) => {
            if (options.header) {
                if (options.header.top_bar_content) {
                    updateFields['options.header.top_bar_content'] = options.header.top_bar_content;
                }
                if (options.header.today_deals) {
                    updateFields['options.header.today_deals'] = options.header.today_deals;
                }
                if (options.header.category_ids) {
                    updateFields['options.header.category_ids'] = options.header.category_ids;
                }
            }

            if (options.footer) {
                if (options.footer.footer_categories) {
                    updateFields['options.footer.footer_categories'] = options.footer.footer_categories;
                }
                if (options.footer.help_center) {
                    updateFields['options.footer.help_center'] = options.footer.help_center;
                }
                if (options.footer.useful_link) {
                    updateFields['options.footer.useful_link'] = options.footer.useful_link;
                }
            }
        };

        // Process all fields
        await processImages();
        flattenObject(options);
        handleArrayFields(options);

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "No valid fields to update" 
            });
        }

        const updatedTheme = await themeOptionModel.findOneAndUpdate(
            { id },
            { $set: updateFields },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!updatedTheme) {
            return res.status(404).json({ 
                success: false, 
                message: "Theme not found" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Theme options updated successfully",
            data: updatedTheme
        });

    } catch (error) {
        console.error('Error updating theme options:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error updating theme options",
            error: error.message
        });
    }
};
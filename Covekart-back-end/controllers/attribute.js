 import attributeModel from "../models/attribute_model.js";

 
 export const putUpdateAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const existingAttribute = await attributeModel.findOne({ id: id });
        if (!existingAttribute) {
            return res.status(404).json({
                message: "Attribute not found"
            });
        }

        if (!data.name || !data.status || !data.style) {
            return res.status(400).json({
                message: "Missing required fields. Please provide name, status, and style"
            });
        }

        const newSlug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
        
        // Check if new slug already exists (excluding current attribute)
        const slugExists = await attributeModel.findOne({
            slug: newSlug,
            id: { $ne: id }
        });
        
        if (slugExists) {
            return res.status(400).json({
                message: "An attribute with this slug already exists"
            });
        }

        // Process attribute values, preserving existing values
        let processedValues = existingAttribute.attribute_values || [];
        if (Array.isArray(data.value)) {
            data.value.forEach(value => {
                // Automatically generate slug if not provided
                const valueSlug = value.slug || value.value.toLowerCase().trim().replace(/\s+/g, '-');
                
                // Check if value already exists
                const existingValueIndex = processedValues.findIndex(
                    v => v.value === value.value.trim()
                );

                const processedValue = {
                    value: value.value.trim(),
                    slug: valueSlug,
                    hex_color: value.hex_color ? value.hex_color.trim() : null,
                    updated_at: new Date()
                };

                if (existingValueIndex !== -1) {
                    // Update existing value
                    processedValues[existingValueIndex] = {
                        ...processedValues[existingValueIndex],
                        ...processedValue,
                        deleted_at: null  // Undelete if previously deleted
                    };
                } else {
                    // Add new value
                    processedValue.created_at = new Date();
                    processedValue.deleted_at = null;
                    processedValues.push(processedValue);
                }
            });
        }

        // Prepare update data
        const updateData = {
            name: data.name.trim(),
            slug: newSlug,
            status: Number(data.status),
            style: data.style.trim(),
            updated_at: new Date(),
            attribute_values: processedValues
        };

        // Update the attribute
        const updatedAttribute = await attributeModel.findOneAndUpdate(
            { id: id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedAttribute) {
            return res.status(404).json({
                message: "Attribute not found or update failed"
            });
        }

       res.status(200).json({
            message: "Attribute updated successfully",
            attribute: updatedAttribute
        });

    } catch (error) {
        console.error("Error updating attribute:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Duplicate key error. Please ensure slugs are unique.",
                error: error.message
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


export const deleteAttributes = async (req, res) => {
    try {
      const { ids } = req.body;
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          message: "No attribute IDs provided",
          success: false,
        });
      }
  
      // Perform a soft delete on all attributes by their IDs
      const result = await attributeModel.deleteMany(
        { id: { $in: ids } },
        { $set: { deleted_at: new Date(), status: false } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({
          message: "No attributes found to delete",
          success: false,
        });
      }
  
      res.status(200).json({
        message: "Attributes deleted successfully",
        success: true,
        deletedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error deleting attributes:", error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  };
  

// export const putUpdateAttribute = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const data = req.body;

//         // Validate if attribute exists
//         const existingAttribute = await attributeModel.findOne({ id: id });
//         if (!existingAttribute) {
//             return res.status(404).json({
//                 message: "Attribute not found"
//             });
//         }

//         // Validate required fields
//         if (!data.name || !data.status || !data.style) {
//             return res.status(400).json({
//                 message: "Missing required fields. Please provide name, status, and style"
//             });
//         }

//         // Generate or validate slug
//         const newSlug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
        
//         // Check if new slug already exists (excluding current attribute)
//         const slugExists = await attributeModel.findOne({
//             slug: newSlug,
//             id: { $ne: id }
//         });
        
//         if (slugExists) {
//             return res.status(400).json({
//                 message: "An attribute with this slug already exists"
//             });
//         }

//         // Process attribute values if provided
//         let processedValues = [];
//         if (Array.isArray(data.value)) {
//             processedValues = data.value.reduce((validValues, value) => {
//                 // Skip invalid entries
//                 if (!value || typeof value !== 'object') {
//                     console.warn('Skipping invalid attribute value:', value);
//                     return validValues;
//                 }

//                 // Validate required fields
//                 if (!value.value || !value.slug) {
//                     console.warn('Skipping attribute value missing required fields:', value);
//                     return validValues;
//                 }

//                 // Create validated attribute value object
//                 const processedValue = {
//                     value: value.value.trim(),
//                     slug: value.slug.toLowerCase().trim(),
//                     hex_color: value.hex_color ? value.hex_color.trim() : null,
//                     updated_at: new Date()
//                 };

//                 // If value has an ID, it's an existing value being updated
//                 if (value.id) {
//                     processedValue.id = value.id;
//                 } else {
//                     // New values get new timestamps
//                     processedValue.created_at = new Date();
//                     processedValue.deleted_at = null;
//                 }

//                 validValues.push(processedValue);
//                 return validValues;
//             }, []);
//         }

//         // Prepare update data
//         const updateData = {
//             name: data.name.trim(),
//             slug: newSlug,
//             status: Number(data.status),
//             style: data.style.trim(),
//             updated_at: new Date()
//         };

//         // If new attribute values are provided, update them
//         if (processedValues.length > 0) {
//             updateData.attribute_values = processedValues;
//         }

//         // Update the attribute
//         const updatedAttribute = await attributeModel.findOneAndUpdate(
//             { id: id },
//             updateData,
//             { new: true, runValidators: true }
//         );

//         if (!updatedAttribute) {
//             return res.status(404).json({
//                 message: "Attribute not found or update failed"
//             });
//         }

//         console.log("Attribute Updated Successfully:", updatedAttribute);
//         res.status(200).json({
//             message: "Attribute updated successfully",
//             attribute: updatedAttribute
//         });

//     } catch (error) {
//         console.error("Error updating attribute:", error);
        
//         if (error.code === 11000) {
//             return res.status(400).json({
//                 message: "Duplicate key error. Please ensure slugs are unique.",
//                 error: error.message
//             });
//         }

//         if (error.name === 'ValidationError') {
//             return res.status(400).json({
//                 message: "Validation error",
//                 error: error.message
//             });
//         }

//         res.status(500).json({
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// };

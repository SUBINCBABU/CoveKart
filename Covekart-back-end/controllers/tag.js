import tagModel from '../models/tag_model.js';

// Function to generate sequential numeric ID
const generateNumericId = async () => {
    try {
        const lastTag = await tagModel.findOne({}, { id: 1 }).sort({ id: -1 });

        // Start from 10000 if no tags exist
        if (!lastTag) return 10000;

        let newId = lastTag.id + 1;

        // Reset to 10000 if it exceeds 99999
        if (newId > 99999) {
            newId = 10000;
        }

        // Ensure no ID collision
        const existingIdTag = await tagModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId(); // Recursively find the next ID
        }

        return newId;
    } catch (error) {
        console.error("Error generating numeric ID:", error);
        throw new Error("Failed to generate a unique numeric ID");
    }
};

// Controller to handle tag creation
export const postCreateTag = async (req, res) => {
  
    
    try {
        const { 
            name, 
            type, 
            description = null, 
            status = true, 
            created_by_id 
        } = req.body;

        // Validate required fields
        if (!name || !type ) {
            return res.status(400).json({
              
                
                message: "Name, type, and created_by_id are required",
                success: false
            });
        }

        // Generate unique slug
        const slug = name.toLowerCase().trim().replace(/\s+/g, '-');

        // Check if tag with the same slug already exists
        const existingTag = await tagModel.findOne({ slug });
        if (existingTag) {
            return res.status(400).json({
                message: "A tag with this name already exists",
                success: false
            });
        }

        // Generate sequential 5-digit numeric ID
        const numericId = await generateNumericId();

        // Create new tag
        const newTag = new tagModel({
            id: numericId,
            name: name.trim(),
            slug,
            type,
            description: description ? description.trim() : null,
            status,
            created_by_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Save tag to the database
        const savedTag = await newTag.save();

        // res.status(200).json({
        //     message: "Tag created successfully",
        //     success: true,
        //     data:savedTag
        // });
        res.status(201).json({
            message: "tag created successfully",
            tag: savedTag
        });

    } catch (error) {
        console.error("Error creating tag:", error);

        // Handle duplicate key error (e.g., for unique fields)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "A tag with the same unique field already exists",
                success: false,
                error: error.message
            });
        }

        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const getTags = async (req, res) => {
    try {
      const { page = 1, limit = 10, type } = req.query;
  
      // Build query object
      const query = type ? { type } : {};
  
      // Fetch tags with pagination
      const tags = await tagModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ created_at: -1 })
        .exec();
  
      // Count total tags
      const total = await tagModel.countDocuments(query);
  
      // Respond with tags and pagination info
      res.status(200).json({
        data: tags,
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ 
        message: 'An error occurred while fetching tags.', 
        error: error.message 
      });
    }
  };
  
  export const updateTag = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      // Validate required fields
      if (!updateData.name || !updateData.type) {
        return res.status(400).json({
          message: "Name and type are required",
          success: false,
        });
      }
  
      // Generate a new slug if the name has changed
      const slug = updateData.name.toLowerCase().trim().replace(/\s+/g, '-');
  
      // Check for duplicate slug (exclude current tag by ID)
      const existingTag = await tagModel.findOne({
        slug,
        id: { $ne: id },
      });
  
      if (existingTag) {
        return res.status(400).json({
          message: "A tag with this name already exists",
          success: false,
        });
      }
  
      // Prepare update payload
      const updatePayload = {
        ...updateData,
        slug,
        updated_at: new Date(),
      };
  
      // Perform the update
      const updatedTag = await tagModel.findOneAndUpdate(
        { id },
        updatePayload,
        { new: true, runValidators: true }
      );
  
      if (!updatedTag) {
        return res.status(404).json({
          message: "Tag not found",
          success: false,
        });
      }
  
      // Return success response
      res.status(200).json({
        message: "Tag updated successfully",
        success: true,
        tag: updatedTag,
      });
    } catch (error) {
      console.error("Error updating tag:", error);
  
      // Handle server errors
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  };
  


  export const deleteTag = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Soft delete the tag by setting `deleted_at` and updating `status` to false
      const deletedTag = await tagModel.findOneAndDelete(
        { id },
        {
          deleted_at: new Date(),
          status: false,
        },
        { new: true }
      );
  
      // Check if the tag exists
      if (!deletedTag) {
        return res.status(404).json({
          message: "Tag not found",
          success: false,
        });
      }
  
      // Respond with success and the updated tag
      res.status(200).json({
        message: "Tag soft deleted successfully",
        success: true,
        tag: deletedTag,
      });
    } catch (error) {
      console.error("Error deleting tag:", error);
  
      // Handle server errors
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  };
  


  export const updateTagStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const updatedTag = await tagModel.findOneAndUpdate(
        { id },
        { status, updated_at: new Date() },
        { new: true }
      );
  
      if (!updatedTag) {
        return res.status(404).json({
          message: "Tag not found",
          success: false,
        });
      }
  
      res.status(200).json({
        message: `Tag status updated to ${status ? 'Active' : 'Inactive'} successfully.`,
        success: true,
        tag: updatedTag,
      });
    } catch (error) {
      console.error("Error updating tag status:", error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  };
  



  export const deleteTags = async (req, res) => {
    try {
      const { ids } = req.body;
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          message: "No tag IDs provided",
          success: false,
        });
      }
  
      // Perform a soft delete on all tags by their IDs
      const result = await tagModel.deleteMany(
        { id: { $in: ids } },
        { $set: { deleted_at: new Date(), status: false } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({
          message: "No tags found to delete",
          success: false,
        });
      }
  
      res.status(200).json({
        message: "Tags deleted successfully",
        success: true,
        deletedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error deleting tags:", error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  };
  
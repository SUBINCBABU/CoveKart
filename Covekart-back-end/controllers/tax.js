import taxModel from "../models/tax_model.js";

const generateNumericId = async () => {
    try {
        const lastTax = await taxModel.findOne({}, { id: 1 }).sort({ id: -1 });

        // Start from 10000 if no tags exist
        if (!lastTax) return 10000;

        let newId = lastTax.id + 1;

        // Reset to 10000 if it exceeds 99999
        if (newId > 99999) {
            newId = 10000;
        }

        // Ensure no ID collision
        const existingIdTax = await taxModel.findOne({ id: newId });
        if (existingIdTax) {
            return generateNumericId(); // Recursively find the next ID
        }

        return newId;
    } catch (error) {
        console.error("Error generating numeric ID:", error);
        throw new Error("Failed to generate a unique numeric ID");
    }
};

// Controller to handle tag creation
export const postCreateTax = async (req, res) => {
  
    
    try {
        const { 
        name,
        rate,
        status,
        } = req.body;

        const slug = name.toLowerCase().trim().replace(/\s+/g, '-');

        // Check if tag with the same slug already exists
        const existingTax = await taxModel.findOne({ slug });
        if (existingTax) {
            return res.status(400).json({
                message: "A tag with this name already exists",
                success: false
            });
        }

        const numericId = await generateNumericId();

        const newTax = new taxModel({
            id: numericId,
            name: name.trim(),
            slug:slug,
            rate:rate,
            status:status,
            created_by_id:1,
            created_at: new Date(),
            updated_at: new Date()
        });

        const savedTax = await newTax.save();

        res.status(201).json({
            message: "tag created successfully",
            tax: savedTax
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


export const getTax=async(req,res)=>{
    try {
        
         const  taxs = await taxModel.find().lean({}); 
        
        if (taxs.length === 0) {            
          return res.status(404).json({ message: "No states found" });
        }
    
        res.status(200).json({
          message: "States retrieved successfully",
          data: taxs,
        });
      } catch (error) {
        console.error("Error retrieving states:", error);
        res.status(500).json({
          message: "Failed to retrieve states",
          error: error.message,
        });
      }
}


export const putUpdateTax = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
     
      if (!updateData.name ) {
        return res.status(400).json({
          message: "Name  are required",
          success: false,
        });
      }
  
      
      const slug = updateData.name.toLowerCase().trim().replace(/\s+/g, '-');
  
      // Check for duplicate slug (exclude current tag by ID)
      const existingTax = await taxModel.findOne({
        slug,
        id: { $ne: id },
      });
  
      if (existingTax) {
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
      const updatedTax= await taxModel.findOneAndUpdate(
        { id },
        updatePayload,
        { new: true, runValidators: true }
      );
  
      if (!updatedTax) {
        return res.status(404).json({
          message: "Tag not found",
          success: false,
        });
      }
  
      // Return success response
      res.status(200).json({
        message: "Tag updated successfully",
        success: true,
        tax: updatedTax,
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
  

  export const updateTaxStatus = async (req, res) => {
    try {
        console.log(req.params);
        
        const { id } = req.params; // Get user ID from URL parameters
        const { status } = req.body; // Get the new status from request body

        // Update the user's status in the database
        const updatedTax = await taxModel.findOneAndUpdate(
            { id },
            { status, updated_at: new Date() }, // Update status and add updated timestamp
            { new: true } // Return the updated document
        );

        if (!updatedTax) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        res.status(200).json({
            message: `User status updated to ${status ? 'Active' : 'Inactive'} successfully.`,
            success: true,
            user: updatedTax, // Send the updated user back
        });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};


export const deleteTax = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTax = await taxModel.findOneAndDelete(
            { id },
            {
                deleted_at: new Date(),
                status: false
            },
            { new: true }
        );

        // Check if the user exists
        if (!deletedTax) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Respond with success and the updated user
        res.status(200).json({
            message: "User soft deleted successfully",
            success: true,
            user: deletedTax,
        });
    } catch (error) {
        console.error("Error deleting user:", error);

        // Handle server errors
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};



export const deleteAllTax = async (req, res) => {
    try {
        const { ids } = req.body; // ids will be an array of user IDs

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No user IDs provided",
            });
        }

        // Soft delete users by updating the status and deleted_at field
        const deletedTax= await taxModel.deleteMany(
            { id: { $in: ids } }, // Find users by the list of IDs
            {
                status: false,       // Mark as deleted
                deleted_at: new Date()  // Set deletion timestamp
            }
        );

        if (deletedTax.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found to delete",
            });
        }

        res.status(200).json({
            success: true,
            message: `${deletedTax.nModified} users soft deleted successfully`,
        });
    } catch (error) {
        console.error("Error deleting users:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

import roleModel from "../models/role_model.js";
import userModel from "../models/user_Model.js";
import bcrypt from "bcrypt"

const generateNumericId = async () => {
    try {
        const lastTag = await userModel.findOne({}, { id: 1 }).sort({ id: -1 });
        const lastId = lastTag?.id ?? 9999;
        let newId = lastId + 1;
        if (newId > 99999) newId = 10000;
        const existingUser = await userModel.findOne({ id: newId });
        if (existingUser) {
            return generateNumericId();
        }
        return newId;
    } catch (error) {
        console.error("Error generating numeric ID:", error);
        throw new Error("Failed to generate a unique numeric ID");
    }
};


export const postCreateUsers = async (req, res) => {
 
    try {
        const { email, phone, password, status } = req.body;

        const existingUser = await userModel.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with the given email or phone number",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const numericId = await generateNumericId();

        const newUser = new userModel({
            ...req.body,
            password: hashedPassword,  // Save the hashed password
            id: numericId,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: savedUser,
        });
    } catch (error) {
        console.error("Error creating user:", error);

        // Check for duplicate key error (e.g., email, phone number)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern).join(", ");
            const value = JSON.stringify(error.keyValue);
            return res.status(400).json({
                success: false,
                message: `Duplicate value found for field: ${field}. Value: ${value}`,
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message || "An unknown error occurred",
        });
    }
};

export const getUsers = async (req, res) => {
  
    
    try {
        const { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const total = await userModel.countDocuments(query);
        const users = await userModel
            .find(query)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const roleIds = users.map(user => user.role_id);
        const roles = await roleModel.find({ id: { $in: roleIds } });
        const usersWithRoles = users.map(user => {
            const userRole = roles.find(role => role.id === user.role_id);
            return { ...user.toObject(), role: userRole };
        });
       //console.log(usersWithRoles);
       
        res.status(200).json({
            success: true,
            data: usersWithRoles,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users.",
            error: error.message,
        });
    }
};



export const updateUsers = async (req, res) => {
    try {
        const { id } = req.params;  // User ID from URL
        const updateData = req.body; // Data to update the user with

        // Check if the user exists
        const existingUser = await userModel.findOne({ id });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if email or phone already exists for another user (excluding the current user)
        if (updateData.email) {
            const emailExists = await userModel.findOne({
                email: updateData.email,
                _id: { $ne: existingUser._id }, // Exclude the current user
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use by another user",
                });
            }
        }

        if (updateData.phone) {
            const phoneExists = await userModel.findOne({
                phone: updateData.phone,
                _id: { $ne: existingUser._id }, // Exclude the current user
            });

            if (phoneExists) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number is already in use by another user",
                });
            }
        }

        // Proceed with the update operation
        const updatedUser = await userModel.findOneAndUpdate(
            { id },
            { $set: updateData },  // Update only the fields provided in the request body
            { new: true }  // Return the updated user document
        );

        // Respond with the updated user
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error updating user:", error);

        // Send an error response
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message || 'An unknown error occurred.',
        });
    }
};


export const updateUsersStatus = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from URL parameters
        const { status } = req.body; // Get the new status from request body

        // Update the user's status in the database
        const updatedUser = await userModel.findOneAndUpdate(
            { id },
            { status, updated_at: new Date() }, // Update status and add updated timestamp
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        res.status(200).json({
            message: `User status updated to ${status ? 'Active' : 'Inactive'} successfully.`,
            success: true,
            user: updatedUser, // Send the updated user back
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


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findOneAndDelete(
            { id },
            {
                deleted_at: new Date(),
                status: false
            },
            { new: true }
        );

        // Check if the user exists
        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Respond with success and the updated user
        res.status(200).json({
            message: "User soft deleted successfully",
            success: true,
            user: deletedUser,
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



export const deleteAllUsers = async (req, res) => {
    try {
        const { ids } = req.body; // ids will be an array of user IDs

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No user IDs provided",
            });
        }

        // Soft delete users by updating the status and deleted_at field
        const deletedUsers = await userModel.deleteMany(
            { id: { $in: ids } }, // Find users by the list of IDs
            {
                status: false,       // Mark as deleted
                deleted_at: new Date()  // Set deletion timestamp
            }
        );

        if (deletedUsers.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found to delete",
            });
        }

        res.status(200).json({
            success: true,
            message: `${deletedUsers.nModified} users soft deleted successfully`,
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

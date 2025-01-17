import moduleModel from "../models/module_model.js";
import permissionModel from "../models/permission_model.js";
import roleModel from "../models/role_model.js";


const generateNumericId = async () => {
    try {
        const lastTag = await roleModel.findOne({}, { id: 1 }).sort({ id: -1 });

        // Start from 10000 if no tags exist
        if (!lastTag) return 10000;

        let newId = lastTag.id + 1;

        // Reset to 10000 if it exceeds 99999
        if (newId > 99999) {
            newId = 10000;
        }

        // Ensure no ID collision
        const existingIdTag = await roleModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId(); // Recursively find the next ID
        }

        return newId;
    } catch (error) {
        console.error("Error generating numeric ID:", error);
        throw new Error("Failed to generate a unique numeric ID");
    }
};


export const postCreateRole = async (req, res) => {
    try {

        const { name, system_reserve, permissions } = req.body;

        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Missing required fields: 'name' or 'guard_name'.",
            });
        }

        if (permissions && !Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: "'permissions' must be an array of permission IDs.",
            });
        }
        const numericId = await generateNumericId();
        const allPermissions = await permissionModel.find({
            id: { $in: permissions }, // Find all permissions where the 'id' is in the 'permissions' array
        });
        //console.log(allPermissions);


        const newRole = new roleModel({
            id: numericId,
            name,
            guard_name: "web",
            system_reserve: system_reserve || false,
            permissions: allPermissions,
            created_at: new Date(),
            updated_at: new Date(),
        });

        const savedRole = await newRole.save();

        return res.status(201).json({
            success: true,
            message: "Role created successfully.",
            data: savedRole,
        });
    } catch (error) {
        console.error("Error creating role:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while creating the role.",
            error: error.message,
        });
    }
};




export const getRoles = async (req, res) => {


    try {
       
        const { page = 1, limit = 10, search = "" } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const searchFilter = search
            ? { name: { $regex: search, $options: "i" } } 
            : {};

        
        const total = await roleModel.countDocuments(searchFilter);


        const roles = await roleModel
            .find(searchFilter)
            .sort({ created_at: -1 }) // Latest roles first
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

const modules=await moduleModel.find().lean()


        // Send the response
        return res.status(200).json({
            success: true,
            message: "Roles fetched successfully.",
            data: roles,
            total,
            modules:modules,
            page: pageNumber,
            limit: limitNumber,
        });
    } catch (error) {
        console.error("Error fetching roles:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while fetching roles.",
            error: error.message,
        });
    }
};



export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await roleModel.findOne({ id });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: `Role with ID ${id} not found.`,
            });
        }
        const modules=await moduleModel.find().lean()
        
        return res.status(200).json(role);
    } catch (error) {
        console.error("Error fetching role:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the role.",
        });
    }
};


export const putUpdateRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, system_reserve, permissions } = req.body;

        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Role ID is required for updating.",
            });
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: 'name'.",
            });
        }

        // Validate that permissions is an array if provided
        if (permissions && !Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: "'permissions' must be an array of permission IDs.",
            });
        }

        // Fetch permissions if provided
        let allPermissions = [];
        if (permissions) {
            allPermissions = await permissionModel.find({
                id: { $in: permissions }, // Find permissions where 'id' matches
            });

            if (allPermissions.length !== permissions.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more permission IDs are invalid.",
                });
            }
        }

        // Prepare the updated data
        const updatedData = {
            name,
            system_reserve: system_reserve || false,
            permissions: allPermissions,
            updated_at: new Date(),
        };

        // Update the role in the database
        const updatedRole = await roleModel.findOneAndUpdate(
            { id },
            updatedData,
            { new: true } // Return the updated document
        );

        // Check if the role was found and updated
        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: `Role with ID ${id} not found.`,
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Role updated successfully.",
            data: updatedRole,
        });
    } catch (error) {
        console.error("Error updating role:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while updating the role.",
            error: error.message,
        });
    }
};


export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate that an ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Role ID is required to delete a role.",
            });
        }

        // Attempt to delete the role by ID
        const deletedRole = await roleModel.findOneAndDelete({ id });

        // If no role was found with the given ID, return a 404 response
        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: `Role with ID ${id} not found.`,
            });
        }

        // Successfully deleted the role
        return res.status(200).json({
            success: true,
            message: "Role deleted successfully.",
            data: deletedRole,
        });
    } catch (error) {
        // Log and return a 500 response for any server error
        console.error("Error deleting role:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while deleting the role.",
            error: error.message,
        });
    }
}



export const deleteAllRoles = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input. Please provide an array of role IDs.',
            });
        }

        // Delete roles with IDs matching the array
        const result = await roleModel.deleteMany({ id: { $in: ids } });

        return res.status(200).json({
            success: true,
            message: 'Roles deleted successfully.',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting roles:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting roles.',
            error: error.message,
        });
    }
};

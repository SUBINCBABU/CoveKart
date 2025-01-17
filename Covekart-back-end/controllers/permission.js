import permissionModel from "../models/permission_model.js";

export const postCreatePermission = async (req, res) => {
   
    try {
      const  permissions  = req.body;
      
      if (!Array.isArray(permissions) || permissions.length === 0) {
        return res.status(400).json({
          success: false,
          message: "The 'permissions' field must be a non-empty array.",
        });
      }
  
      for (let permission of permissions) {
        const { id, name, guard_name, pivot } = permission;

        if (!id || !pivot.permission_id || !name) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields: 'id', 'permission_id', or 'name' for one of the permissions.",
          });
        }

      
        const existingPermission = await permissionModel.findOne({ id });
        if (existingPermission) {
          return res.status(409).json({
            success: false,
            message: `A permission with the ID ${id} already exists.`,
          });
        }

        
        permission.guard_name = guard_name || "web";
        permission.created_at = new Date();
        permission.updated_at = new Date();
        permission.pivot = pivot || { role_id: null, permission_id };
      }

    
      const savedPermissions = await permissionModel.insertMany(permissions);
  
      return res.status(201).json({
        success: true,
        message: "Permissions created successfully.",
        data: savedPermissions,
      });
    } catch (error) {
      console.error("Error creating permissions:", error);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred while creating the permissions.",
        error: error.message,
      });
    }
};

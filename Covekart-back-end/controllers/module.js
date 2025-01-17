import moduleModel from "../models/module_model.js";



export const postCreateModule = async (req, res) => {
  try {
   
    const modules = req.body;
    if (!Array.isArray(modules) || modules.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array of modules' });
    }
    const validatedModules = modules.map((module) => {
      const { id, name, sequence, created_at, updated_at, deleted_at, module_permissions } = module;

      if (!id || !name || !sequence || !module_permissions) {
        throw new Error('Each module must have id, name, sequence, and module_permissions');
      }

      return {
        id,
        name,
        sequence,
        created_at: created_at || new Date(),
        updated_at: updated_at || new Date(),
        deleted_at: deleted_at || null,
        module_permissions,
      };
    });
    const savedModules = await moduleModel.insertMany(validatedModules);
    return res.status(201).json({
      message: 'Modules created successfully',
      data: savedModules,
    });
  } catch (error) {
    console.error('Error creating modules:', error);
    return res.status(500).json({
      error: 'An error occurred while creating the modules',
      details: error.message,
    });
  }
};


export const getRoleModules=async (req,res)=>{
    try {
        const modules = await moduleModel.find();
       
        return res.status(200).json(modules);
      } catch (error) {
        console.error("Error fetching modules:", error);
        return res.status(500).json({
          success: false,
          message: "An error occurred while fetching modules.",
        });
      }

}



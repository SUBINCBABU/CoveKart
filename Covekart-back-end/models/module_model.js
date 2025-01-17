import mongoose from "mongoose"
const { Schema } = mongoose;

// Define the modulePermissions schema
const ModulePermissionSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  module_id: { type: String, required: true },
  permission_id: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  deleted_at: { type: Date, default: null },
});

// Define the main module schema
const ModuleSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  sequence: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  deleted_at: { type: Date, default: null },
  module_permissions: { type: [ModulePermissionSchema], required: true },
});

// Create the model
const moduleModel = mongoose.model('Module', ModuleSchema);
export default moduleModel

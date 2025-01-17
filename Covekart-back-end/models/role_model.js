import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Role Schema
const roleSchema = new Schema(
  {
    id: {
    type: Number,
    required: true,
  },
    name: {
      type: String,
      required: true,
    },
    guard_name: {
      type: String,
      required: true,
    },
    system_reserve: {
      type: Boolean,
      default: false,
    },
    permissions:[],
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

// Create the Role Model
const roleModel = mongoose.model("Role", roleSchema);

export default roleModel;

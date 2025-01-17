import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Sub-schema for attribute values
const attributeValueSchema = new Schema(
  {
    value: { type: String }, // Value (e.g., "1 Liter")
    slug: { type: String, unique: true }, // Slug for the value (should be unique if required)
    hex_color: { type: String, default: null }, // Optional hex color
    created_at: { type: Date, default: Date.now }, // Creation date
    updated_at: { type: Date, default: Date.now }, // Last update date
    deleted_at: { type: Date, default: null }, // Soft delete
  },
  { _id: true } // Enable unique ID for each attribute value
);

// Main schema for attributes
const attributeSchema = new Schema(
  {
    id: { type: Number, unique: true, required: true }, // Unique ID for the attribute
    name: { type: String, required: true }, // Attribute name (e.g., Size, Color)
    slug: { type: String, unique: true }, // Slug for the attribute
    status: { type: Number, required: true }, // Status (e.g., 1 for active, 0 for inactive)
    style: { type: String, required: true }, // Style type (e.g., dropdown, radio buttons)
    created_by_id: { type: String }, // ID of the user who created it
    attribute_values: [attributeValueSchema], // Array of attribute value objects
    deleted_at: { type: Date, default: null }, // Soft delete timestamp
  },  
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Manage timestamps automatically
  }
);

// Create and export the model
const attributeModel = mongoose.model("attributes", attributeSchema);

export default attributeModel;

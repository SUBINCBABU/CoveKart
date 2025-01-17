import mongoose from "mongoose";

const schema = mongoose.Schema;

// Define the subcategory schema
const subCategorySchema = new schema(
  {
    id: { type: Number, required: true, unique: true }, // Unique ID for the subcategory
    name: { type: String, required: true }, // Name of the subcategory
    slug: { type: String, unique: true, required: true }, // URL-friendly unique identifier
    description: { type: String }, // Optional description for the subcategory
    type: { type: String, required: true }, // Type (e.g., physical, digital)
    created_by_id:{type: Number, required: true},
    parent_id: { type: Number, ref: "categories", default: null }, // Reference to the parent category (if any)
    
    // Image and icon references
    category_image: {}, 
    category_icon: {}, 
    
    // Optional fields
    commission_rate: { type: Number, default: 0 }, 
    subcategories: [{ type: Number, ref: "categories" }],
    status: { type: Boolean, required: true, default: true }, 
    created_by_id: { type: Number }, 
    created_at: { type: Date, default: Date.now }, 
    updated_at: { type: Date, default: Date.now }, 
    deleted_at: { type: Date, default: null }, 
  },
  { timestamps: true }
);

const subCategoryModel = mongoose.model("subcategories", subCategorySchema);

export default subCategoryModel;

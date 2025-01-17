import mongoose from "mongoose";

const schema = mongoose.Schema;

const categorySchema = new schema(
  {
    id: { type: Number, required: true, unique: true }, // Numeric ID for category
    name: { type: String, required: true }, // Category name
    slug: { type: String, unique: true }, // Unique slug for the category
    description: { type: String }, // Description
    created_by_id:{type: Number, required: true},
    type: { type: String, required: true }, // Type of category (e.g., 'physical', 'digital')
    parent_id: { type: Number, ref: 'categories', default: null }, // Parent category ID (nullable)
    category_image: {}, // Reference to the category's image (array of image IDs)
    category_icon: {}, // Reference to category icon (array of image IDs)
    commission_rate: { type: Number, default: 0 }, // Commission rate
    subcategories: [{ type: Number, ref: 'categories' }], // Array of subcategories (referencing 'categories' collection)
    status: { type: Boolean, required: true, default: true }, // Category status (active or not)
    created_by_id: { type: Number }, // ID of the user who created the category
    created_at: { type: Date, default: Date.now }, // Category creation timestamp
    updated_at: { type: Date, default: Date.now }, // Timestamp for the last update
    deleted_at: { type: Date, default: null }, // Soft delete timestamp (nullable)
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel;

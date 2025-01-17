

import attributeModel from "../models/attribute_model.js";
import categoryModel from "../models/category_model.js";
import ImageModel from "../models/images_model.js";
import productModel from "../models/product_model.js";
import reviewModel from "../models/review_model.js";
import storeModel from "../models/store_model.js";
import tagModel from "../models/tag_model.js";
import taxModel from "../models/tax_model.js";

// Utility function to generate unique numeric ID
const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = 99999;

    try {
        const lastTag = await productModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        const existingIdTag = await productModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId(); // Recursively try next ID
        }

        return newId;
    } catch (error) {
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

// Validate required fields
const validateProductInput = (data) => {
    const requiredFields = ['name', 'store_id', 'price', 'quantity'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (data.price < 0) throw new Error('Price cannot be negative');
    if (data.quantity < 0) throw new Error('Quantity cannot be negative');
    if (data.discount && (data.discount < 0 || data.discount > 100)) {
        throw new Error('Discount must be between 0 and 100');
    }
};

// Calculate sale price
const calculateSalePrice = (price, discount) => {
    if (!discount) return price;
    return price - (price / 100) * discount;
};

// Generate slug from product name
const generateSlug = (name) => {
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
};

export const postAddProduct = async (req, res) => {
    try {

        validateProductInput(req.body);

        const {
            name, store_id, price, discount, categories, tags,
            product_thumbnail_id, product_galleries_id, size_chart_image_id,
            product_meta_image_id, tax_id, unit, ...otherFields
        } = req.body;


        const [category, tag, store, tax] = await Promise.all([
            categories ? categoryModel.find({ id: { $in: categories } }) : [],
            tags ? tagModel.find({ id: { $in: tags } }) : [],
            storeModel.findOne({ id: store_id }),
            tax_id ? taxModel.findOne({ id: tax_id }).lean() : null
        ]);

        if (categories && (!category || category.length === 0)) {
            throw new Error('Invalid categories provided');
        }

        if (!store) {
            throw new Error('Invalid store ID');
        }

        const [product_thumbnail, product_galleries, size_chart_image, product_meta_image] = await Promise.all([
            product_thumbnail_id ? ImageModel.findOne({ id: product_thumbnail_id }).lean() : null,
            product_galleries_id ? ImageModel.find({ id: { $in: product_galleries_id } }) : [],
            size_chart_image_id ? ImageModel.findOne({ id: size_chart_image_id }).lean() : null,
            product_meta_image_id ? ImageModel.findOne({ id: product_meta_image_id }).lean() : null
        ]);


        let attributes = [];
        if (unit === '1 KG') {
            const weightAttribute = await attributeModel.findOne({ name: 'Weight' }).lean();
            if (weightAttribute) attributes = [weightAttribute];
        }

        const numericId = await generateNumericId();
        const sale_price = calculateSalePrice(price, discount);
        const slug = generateSlug(name);   


        const productData = {
            id: numericId,
            slug,
            name,
            store_id,
            store,
            price,
            discount,
            sale_price,
            categories: category.length ? [...category, { product_id: numericId, category_id: category[0].id }] : [],
            tags: tag,
            attributes,
            product_thumbnail: product_thumbnail || null,
            product_galleries: product_galleries || [],
            size_chart_image: size_chart_image || null,
            product_meta_image: product_meta_image || null,
            tax: tax || null,
            pivot:{},
            ...otherFields
        };

        const newProduct = new productModel(productData);
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });

    } catch (error) {
        console.error("Error in postAddProduct:", error);
        res.status(error.message.includes('Missing required fields') ? 400 : 500)
            .json({ error: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, filter } = req.query;
        const skip = (page - 1) * limit;

        const query = {};
        if (filter) {

        }

        const [products, total] = await Promise.all([
            productModel.find(query)
                .sort(sort || { createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            productModel.countDocuments(query)
        ]);

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            data: products,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error in getProduct:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw new Error('Product ID is required');

        const product = await productModel.findOne({ id }).lean();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Error in editProduct:", error);
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};



//update



const validateUpdateData = (data) => {
    const errors = [];

    if (data.price && data.price < 0) {
        errors.push('Price cannot be negative');
    }

    if (data.discount && (data.discount < 0 || data.discount > 100)) {
        errors.push('Discount must be between 0 and 100');
    }

    if (data.quantity && data.quantity < 0) {
        errors.push('Quantity cannot be negative');
    }

    if (data.sale_starts_at && data.sale_expired_at) {
        const startDate = new Date(data.sale_starts_at);
        const endDate = new Date(data.sale_expired_at);
        if (startDate >= endDate) {
            errors.push('Sale start date must be before sale end date');
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Validate the update data
        validateUpdateData(updateData);

        // Find existing product
        const existingProduct = await productModel.findOne({ id });
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Update slug if name is changed
        if (updateData.name) {
            updateData.slug = generateSlug(updateData.name);
        }

        // Handle related entities updates
        const updates = [];

        // Update categories if provided
        if (updateData.categories) {
            const categories = await categoryModel.find({ id: { $in: updateData.categories } });
            if (categories.length > 0) {
                updateData.categories = [
                    ...categories,
                    { product_id: id, category_id: categories[0].id }
                ];
            }
            updates.push('categories');
        }

        // Update tags if provided
        if (updateData.tags) {
            const tags = await tagModel.find({ id: { $in: updateData.tags } });
            updateData.tags = tags;
            updates.push('tags');
        }

        // Update store if store_id is changed
        if (updateData.store_id) {
            const store = await storeModel.findOne({ id: updateData.store_id });
            if (!store) {
                throw new Error('Invalid store ID');
            }
            updateData.store = store;
            updates.push('store');
        }

        // Update tax if tax_id is changed
        if (updateData.tax_id) {
            const tax = await taxModel.findOne({ id: updateData.tax_id }).lean();
            updateData.tax = tax;
            updates.push('tax');
        }

        // Update images if provided
        if (updateData.product_thumbnail_id) {
            const thumbnail = await ImageModel.findOne({ id: updateData.product_thumbnail_id }).lean();
            updateData.product_thumbnail = thumbnail;
            updates.push('product_thumbnail');
        }

        if (updateData.product_galleries_id) {
            const galleries = await ImageModel.find({ id: { $in: updateData.product_galleries_id } });
            updateData.product_galleries = galleries;
            updates.push('product_galleries');
        }

        if (updateData.size_chart_image_id) {
            const sizeChart = await ImageModel.findOne({ id: updateData.size_chart_image_id }).lean();
            updateData.size_chart_image = sizeChart;
            updates.push('size_chart_image');
        }

        if (updateData.product_meta_image_id) {
            const metaImage = await ImageModel.findOne({ id: updateData.product_meta_image_id }).lean();
            updateData.product_meta_image = metaImage;
            updates.push('product_meta_image');
        }

        // Update attributes if unit is changed to KG
        if (updateData.unit === 'KG') {
            const weightAttribute = await attributeModel.findOne({ name: 'Weight' }).lean();
            if (weightAttribute) {
                updateData.attributes = [weightAttribute];
                updates.push('attributes');
            }
        }

        // Update sale price if price or discount is changed
        if (updateData.price || updateData.discount !== undefined) {
            const newPrice = updateData.price || existingProduct.price;
            const newDiscount = updateData.discount !== undefined ? updateData.discount : existingProduct.discount;
            updateData.sale_price = calculateSalePrice(newPrice, newDiscount);
        }

        // Perform the update
        const updatedProduct = await productModel.findOneAndUpdate(
            { id },
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updates: updates.length > 0 ? updates : ['basic information'],
            data: updatedProduct
        });

    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(error.message.includes('validation failed') ? 400 : 500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};



export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Product ID is required." });
        }
        const deleteProduct = await productModel.findOne({ id: id });
        if (!deleteProduct) {
            return res.status(404).json({ error: "Product not found." });
        }
        await reviewModel.findOneAndDelete({ product_name: deleteProduct.name });
        await productModel.findOneAndDelete({ id: id });

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while deleting the product.",
            details: error.message,
        });
    }
};



export const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;


        if (!id) {
          
            return res.status(400).json({ error: "product ID is required" });
        }

        if (status === undefined || status === null) {
           
            return res.status(400).json({ error: "Status is required" });
        }

        const updatedProduct = await productModel.findOneAndUpdate(
            { id },
            { status, updated_at: new Date() },
            { new: true, lean: true }
        );

        if (!updatedProduct) {
            console.log("not working");
           
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product status updated successfully", data: updateProduct });
    } catch (error) {
        console.log(" last not working");
           
        console.error(`Error updating product status: ${error.message}`);
        res.status(500).json({ error: `Failed to update Product status: ${error.message}` });
    }


}



export const deleteAllProduct = async (req, res) => {
    try {
        const { ids } = req.body;

        // Validate input
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No product IDs provided.",
            });
        }

        // Find products to delete
        const productsToDelete = await productModel.find({ id: { $in: ids } });
        if (productsToDelete.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for the provided IDs.",
            });
        }

        // Delete associated reviews
        const productNames = productsToDelete.map((product) => product.name);
        await reviewModel.deleteMany({ product_name: { $in: productNames } });

        // Delete the products
        const deleteResult = await productModel.deleteMany({ id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${deleteResult.deletedCount} products and their associated reviews deleted successfully.`,
        });
    } catch (error) {
        console.error(`Error deleting products: ${error.message}`);
        res.status(500).json({
            success: false,
            message: `Failed to delete products: ${error.message}`,
        });
    }
};






export const approveProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_approved } = req.body;

        // Validate id
        if (!id) {
            return res.status(400).json({ 
                success: false,
                error: "Product ID is required" 
            });
        }

        // Validate is_approved
        if (typeof is_approved !== 'number' || ![0, 1].includes(is_approved)) {
            return res.status(400).json({ 
                success: false,
                error: "is_approved must be either 0 or 1" 
            });
        }

        // Try to update the product
        const updatedProduct = await productModel.findOneAndUpdate(
            { id: id }, // Assuming id refers to MongoDB's _id
            { 
                is_approved,
                updated_at: new Date()
            },
            { 
                new: true,
                lean: true,
                runValidators: true
            }
        );

        // Check if product exists
        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false,
                error: "Product not found" 
            });
        }

        // Success response
        return res.status(200).json({ 
            success: true,
            message: "Product status updated successfully",
            data: updatedProduct // Fixed variable name from updateProduct
        });

    } catch (error) {
        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid Product ID format"
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed: " + error.message
            });
        }

        // Log the error for debugging
        console.error('Error updating product status:', error);

        // Generic error response
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

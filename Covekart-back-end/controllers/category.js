import categoryModel from "../models/category_model.js";
import ImageModel from "../models/images_model.js";
import subCategoryModel from "../models/subcategory_model.js";
import current_admin from "./admin_login.js";


async function idGenerate() {
    function generateFiveDigitRandomNumber() {
        return Math.floor(10000 + Math.random() * 90000); // Ensures a 5-digit number
    }

    try {
        let newid;
        let isUnique = false;

        // Loop until a unique ID is  found
        while (!isUnique) {
            newid = generateFiveDigitRandomNumber();
            const existingCategory = await categoryModel.findOne({ id: newid });
            if (!existingCategory) {
                isUnique = true; // Found a unique ID
            }
        }      

        console.log("Generated Unique ID:", newid);
        return newid; // Return the unique ID    
    } catch (error) {
        console.error("Error generating unique ID:", error);
        throw error;
    }
}




export const postCreateCategory = async (req, res) => {
    try {
        const newid = await idGenerate();
        const data = req.body;
      
        
        if (!data || !data.name || !data.type) {
            return res.status(400).json({ message: 'Invalid data: Missing required fields (name or type)' });
        }
        const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-');
        const existingCategory = await categoryModel.findOne({ slug });
        const existingSubCategory = await subCategoryModel.findOne({ slug });
        if (existingCategory || existingSubCategory) {
            return res.status(400).json({ message: 'Slug already exists. Please provide a unique name or slug.' });
        }

        let categoryImage = await ImageModel.findOne({ id: data.category_image_id }).lean();
        let categoryIcon = await ImageModel.findOne({ id: data.category_icon_id }).lean();

        if (data.parent_id) {
            const parentCategory = await categoryModel.findOne({ id: data.parent_id });
            if (!parentCategory) {
                return res.status(404).json({ message: 'Parent category not found' });
            }
            const created_by_id = current_admin[0].id
            const subCategory = new subCategoryModel({
                id: newid,
                name: data.name,
                slug,
                created_by_id:created_by_id,
                description: data.description || '',
                parent_id: data.parent_id,
                type: data.type,
                commission_rate: data.commission_rate || 0,
                category_image_id: data.category_image_id,
                category_icon_id: data.category_icon_id,
                category_image: categoryImage ,
                category_icon: categoryIcon ,
                status: data.status !== undefined ? data.status : true,
            });

            const savedSubCategory = await subCategory.save();

            // Update parent category with new subcategory ID
            await categoryModel.findOneAndUpdate(
                { id: data.parent_id },
                { $push: { subcategories: savedSubCategory.id } },
                { new: true }
            );

            return res.status(201).json({
                message: 'Subcategory created successfully',
                category: savedSubCategory,
            });
        }
       // console.log(current_user[0].id);
        
        const created_by_id = current_admin[0].id
        const category = new categoryModel({
            id: newid,
            name: data.name,
            slug,
            created_by_id:created_by_id,
            description: data.description || '',  
            parent_id: null,
            type: data.type,
            commission_rate: data.commission_rate || 0,
            category_image: categoryImage ,
            category_icon: categoryIcon,
            status: data.status !== undefined ? data.status : true,
        });

        const savedCategory = await category.save();
  
        return res.status(201).json({
            message: 'Category created successfully',
            category: savedCategory,
        });
    } catch (error) {  
        console.error("Error creating category:", error);
        return res.status(500).json({
            message: 'Failed to create category',
            error: error.message,
        });
    }
};



export const getCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find().lean();
        for (let category of categories) {
            if (category.subcategories && category.subcategories.length > 0) {
                category.subcategories = await subCategoryModel
                    .find({ id: { $in: category.subcategories } })
                    .lean();
                for (let subcategory of category.subcategories) {

                    if (subcategory.category_image && subcategory.category_image.length > 0) {
                        subcategory.category_image = await ImageModel
                            .find({ id: { $in: subcategory.category_image } })
                            .lean();
                    }

                    if (subcategory.category_icon && subcategory.category_icon.length > 0) {
                        subcategory.category_icon = await ImageModel
                            .find({ id: { $in: subcategory.category_icon } })
                            .lean();
                    }
                }
            }
            if (category.category_image && category.category_image.length > 0) {
                category.category_image = await ImageModel
                    .find({ id: { $in: category.category_image } })
                    .lean();
            }
            if (category.category_icon && category.category_icon.length > 0) {
                category.category_icon = await ImageModel
                    .find({ id: { $in: category.category_icon } })
                    .lean();
            }
        }
        if (categories.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Categories retrieved successfully',
                data:categories,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No categories found',
            });
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error, please try again later',
            error: error.message,
        });
    }
};

export const getCategoryToUpdate = async (req, res) => {
    
    const category = await categoryModel.findOne({ id: req.params.id }).lean()
    if (category) {
        res.status(200).json(category)
    }
    else {
        const subCategory = await subCategoryModel.findOne({ id: req.params.id }).lean()
        if (subCategory) {
            res.status(200).json(subCategory)
        }
        else {
            res.status(400)
        }
    }
    res.status(400)
}





export const putUpdateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!data || !data.name) {
            return res.status(400).json({ message: 'Invalid data: Missing required fields (name).' });
        }
        const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-');

        const existingCategory = await categoryModel.findOne({ slug, id: { $ne: id } });
        const existingSubCategory = await subCategoryModel.findOne({ slug, id: { $ne: id } });

        if (existingCategory || existingSubCategory) {
            return res.status(400).json({ message: 'Slug already exists. Please provide a unique name or slug.' });
        }

        let categoryImage = null;
        let categoryIcon = null;

        if (data.category_image_id) {
            categoryImage = await ImageModel.findOne({ id: data.category_image_id });
            if (!categoryImage) {
                return res.status(404).json({ message: 'Category image not found.' });
            }
        }

        if (data.category_icon_id) {
            categoryIcon = await ImageModel.findOne({ id: data.category_icon_id });
            if (!categoryIcon) {
                return res.status(404).json({ message: 'Category icon not found.' });
            }
        }

        // Handle subcategory update if parent_id is provided
        if (data.parent_id) {
            // Ensure the parent category exists
            const parentCategory = await categoryModel.findOne({ id: data.parent_id });
            if (!parentCategory) {
                return res.status(404).json({ message: 'Parent category not found.' });
            }

            // Update subcategory
            const updatedSubCategory = await subCategoryModel.findOneAndUpdate(
                { id },
                {
                    $set: {
                        name: data.name,
                        description: data.description || '',
                        parent_id: data.parent_id,
                        type: data.type,
                        commission_rate: data.commission_rate || 0,
                        status: data.status !== undefined ? data.status : true,
                        slug: slug,
                        category_image: categoryImage ,
                        category_icon: categoryIcon
                    },
                },
                { new: true } // Return the updated document
            ).lean();

            if (!updatedSubCategory) {
                return res.status(404).json({ message: 'Subcategory not found.' });
            }

            return res.status(200).json({
                message: 'Subcategory updated successfully.',
                data: updatedSubCategory,
            });
        }

        // Handle category update
        const updatedCategory = await categoryModel.findOneAndUpdate(
            { id },
            {
                $set: {
                    name: data.name,
                    description: data.description || '',
                    type: data.type,
                    commission_rate: data.commission_rate || 0,
                    status: data.status !== undefined ? data.status : true,
                    slug: slug,
                    category_image: categoryImage ,
                    category_icon: categoryIcon,
                },
            },
            { new: true } // Return the updated document
        ).lean();

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        return res.status(200).json({
            message: 'Category updated successfully.',
            data: updatedCategory,
        });
    } catch (error) {
        console.error('Error updating category or subcategory:', error);
        return res.status(500).json({
            message: 'Failed to update category or subcategory.',
            error: error.message,
        });
    }
};



export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findOne({ id });
        if (category) {
            await subCategoryModel.deleteMany({ parent_id: id });
            await categoryModel.deleteOne({ id });
            return res.status(200).json({
                message: 'Category and associated subcategories deleted successfully',
            });
        }

        const subCategory = await subCategoryModel.findOne({ id });

        if (subCategory) {
            await categoryModel.updateOne(
                { id: subCategory.parent_id },
                { $pull: { subcategories: subCategory.id } }
            );

            await subCategoryModel.deleteOne({ id });

            return res.status(200).json({
                message: 'Subcategory deleted successfully',
            });
        }
        return res.status(404).json({ message: 'Category or subcategory not found' });
    } catch (error) {
        console.error('Error deleting category or subcategory:', error);
        return res.status(500).json({
            message: 'Failed to delete category or subcategory',
            error: error.message,
        });
    }
};





import { current_user } from './user_controller.js';
import ProductModel from '../models/product_model.js';
import userModel from '../models/user_Model.js';


export const postWishlist = async (req, res) => {
   
    try {

        if (!current_user || current_user.length === 0) {
            return res.status(401).json({ message: "Unauthorized: No current user found." });
        }

        const product_id = req.body.product_id;


        if (!product_id) {
            return res.status(400).json({ message: "Bad Request: Product ID is required." });
        }




        const user = await userModel.findOne({ id: current_user[0].id }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }


        let wishlist = user.wishlist || [];


        if (wishlist.includes(product_id)) {

            await userModel.findOneAndUpdate({ id: user.id }, { $pull: { wishlist: product_id } });
           
            const wishlist_products = await ProductModel.find({ id: { $in: wishlist.filter(id => id !== product_id) } }).lean();
            return res.status(200).json({
                message: "Product removed from wishlist.",
                wishlist: wishlist_products,
            });
        } else {

            await userModel.findOneAndUpdate({ id: user.id }, { $push: { wishlist: product_id } });
           
            const wishlist_products = await ProductModel.find({ id: { $in: [...wishlist, product_id] } }).lean();
            return res.status(200).json({
                message: "Product added to wishlist.",
                wishlist: wishlist_products,
            });
        }
    } catch (error) {

        console.error("Error in postWhishlist:", error);


        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error: Invalid data format." });
        }

        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};


export const getWishlist = async (req, res) => {
    try {
        if (!current_user || current_user.length === 0) {
            return res.status(400).json({ error: "Current user not found or not logged in." });
        }
        const user = await userModel.findOne({ id: current_user[0].id }).lean();
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        if (!user.wishlist || user.wishlist.length === 0) {
            return res.status(404).json({ error: "Wishlist is empty." });
        }
        let whishlist_product = await ProductModel.find({ id: user.wishlist }).lean({})
        if (!whishlist_product || whishlist_product.length === 0) {
            return res.status(404).json({ error: "No products found in the wishlist." });
        }
        res.status(200).json({ data: whishlist_product });
    } catch (error) {
        console.error("Error in getWhishlist:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};


export const deleteWishlist = async (req, res) => {
  
    try {

        let product_id = req.params.id;


        if (!product_id) {
            return res.status(400).json({ message: "Bad Request: Product ID is required." });
        }

        product_id = parseInt(product_id);
        if (isNaN(product_id)) {
            return res.status(400).json({ message: "Bad Request: Product ID must be a valid number." });
        }
        if (!current_user || current_user.length === 0) {
            return res.status(401).json({ message: "Unauthorized: No current user found." });
        }


        const user = await userModel.findOne({ id: current_user[0].id }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }


        let array = user.wishlist || [];
        let index = array.indexOf(product_id);

        if (index === -1) {
            return res.status(404).json({ message: "Product not found in wishlist." });
        }

        array.splice(index, 1);
        const updatedUser = await userModel.findOneAndUpdate(
            { id: user.id },
            { wishlist: array },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to update the user's wishlist." });
        }
        return res.status(200).json({ message: "Product successfully removed from wishlist." });

    } catch (error) {

        console.error("Error in deleteWishlist:", error);


        if (error.name === "CastError") {
            return res.status(400).json({ message: "Bad Request: Invalid data format." });
        }

        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// https://docs.pixelstrap.net/laravel/fastkart/review.html    
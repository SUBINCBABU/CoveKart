
import cartModel from "../models/cart_model.js";
import { current_user } from "./user_controller.js";


const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {
        const lastCart = await cartModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastCart ? lastCart.id + 1 : MIN_ID;

        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        const existingIdTag = await cartModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const createCart = async (req, res) => {
         
    try {
        if (!current_user || !current_user[0]) {
            return res.status(400).json({ message: "please login" });
        }
        
        const product = req.body.product
        const price = product.sale_price
        const numericId = await generateNumericId();
        const total_price = req.body.quantity * price
        
        const cart = new cartModel({
            id: numericId,
            product_id: req.body.product_id,
            variation_id: req.body.variation_id,
            consumer_id: current_user[0].id,
            quantity: req.body.quantity,
            sub_total: total_price,                                                                                                 
            product: req.body.product,
        });

        const data = await cart.save();
        res.status(201).json(data);
    } catch (error) {
        console.error(`Error creating cart: ${error.message}`);
        res.status(500).json({ message: `Failed to create cart: ${error.message}` });
    }
};

export const getCart = async (req, res) => {
    try {   
        if (!current_user || !current_user[0]) {
            return res.status(200).json(null);
        }

        const consumer_id = current_user[0].id;
        const items = await cartModel.find({ consumer_id }).lean();

        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No items found in the cart.",data:null });
        }


        res.status(200).json({ items });
    } catch (error) {
        console.error(`Error fetching cart: ${error.message}`);
        res.status(500).json({ message: `Failed to fetch cart: ${error.message}` });
    }
};



export const deleteCart = async (req, res) => {
    try {
        if(!current_user[0]){
            return res.status(404).json({ message: "login" });
        }

        if(current_user[0]){
            
            const { id } = req.params;
            const cartItem = await cartModel.findOne({ id });

            if (!cartItem) {
                return res.status(404).json({ message: "Cart item not found." });
            }
    
            await cartModel.deleteOne({ id });
    
    
            res.status(200).json({ message: "Cart item deleted successfully." });
        }
        
    } catch (error) {
        console.error(`Error deleting cart item: ${error.message}`);
        res.status(500).json({ message: "Failed to delete cart item.", error: error.message });
    }
};
    
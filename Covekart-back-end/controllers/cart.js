
import cartModel from "../models/cart_model.js";


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

        
        const jwt =req.headers.authorization;
        const base64Url = jwt.split('.')[1]; 
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));

        if (!decodedData.id) {
            return res.status(200).json({ error: " invalid user" });
        }

       
        
        const product = req.body.product
        const price = product.sale_price
        const numericId = await generateNumericId();
        const total_price = req.body.quantity * price
        
        const cart = new cartModel({
            id: numericId,
            product_id: req.body.product_id,
            variation_id: req.body.variation_id,
            consumer_id: decodedData.id,
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


// export const createCart = async (req, res) => {
//     try {
//         // Check if user is authenticated
//         if (!current_user || !current_user[0]) {
//             return res.status(401).json({ message: "Please login" });
//         }

//         const { product, quantity, id, product_id, variation_id } = req.body;

//         // Validate required fields
//         if (!product || !quantity || !product_id) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         const price = product.sale_price;
//         const total_price = quantity * price;

//         if (id) {
//             // If cart ID exists, update the existing cart
//             const current_cart = await cartModel.findOne({ id }).lean();

//             if (!current_cart) {
//                 return res.status(404).json({ message: "Cart not found" });
//             }

//             const updatedQuantity = current_cart.quantity + quantity;

//             const updateData = {
//                 $set: {
//                     quantity: updatedQuantity,
//                     sub_total: updatedQuantity * price,
//                 },
//             };

//             const updatedCart = await cartModel.findOneAndUpdate(
//                 { id },
//                 updateData,
//                 { new: true }
//             );
//             const result=await cartModel.findOne({id:req.body.id})         
//             return res.status(200).json(result);
//         }

//         // If no cart ID, create a new cart
//         const numericId = await generateNumericId();

//         const newCart = new cartModel({
//             id: numericId,
//             product_id,
//             variation_id,
//             consumer_id: current_user[0].id,
//             quantity,
//             sub_total: total_price,
//             product,
//         });

//         const savedCart = await newCart.save();
//         res.status(201).json(savedCart);
//     } catch (error) {
//         console.error(`Error creating cart: ${error.message}`);
//         res.status(500).json({ message: `Failed to create cart: ${error.message}` });
//     }
// };



export const getCart = async (req, res) => {
    try {   
        

        const jwt =req.headers.authorization;
        const base64Url = jwt.split('.')[1]; 
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));

        if (!decodedData.id) {
            return res.status(200).json({ error: " please login" });
        }

        const consumer_id = decodedData.id;
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

       

       
        const jwt =req.headers.authorization;
        const base64Url = jwt.split('.')[1]; 
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));

        if (!decodedData.id) {
            return res.status(200).json({ error: " invalid user" });
        }

        if (decodedData) {

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

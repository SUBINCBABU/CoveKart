import countryModel from "../models/country.model.js";
import ImageModel from "../models/images_model.js";
import stateModel from "../models/state_model.js";
import storeModel from "../models/store_model.js";
import current_user from "../controllers/admin_login.js"
import userModel from "../models/user_Model.js";
import roleModel from "../models/role_model.js";
const generateNumericId = async () => {
    try {
        const lastTag = await storeModel.findOne({}, { id: 1 }).sort({ id: -1 });
        if (!lastTag) return 10000;
        let newId = lastTag.id + 1;
        if (newId > 99999) {
            newId = 10000;
        }
        const existingIdTag = await storeModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error("Error generating numeric ID:", error);
        throw new Error("Failed to generate a unique numeric ID");
    }
};

export const postCreateStore = async (req, res) => {

    try {
        const {
            store_name,
            description,
            country_id,
            state_id,
            city,
            address,
            pincode,
            name,
            email,
            phone,
            country_code,
            password,
            store_logo_id,
            hide_vendor_email,
            hide_vendor_phone,
            status,
            facebook,
            instagram,
            pinterest,
            youtube,
            twitter,
        } = req.body;
        if (!store_name || !email || !password) {
            return res.status(400).json({
                error: "Missing required fields: store_name, email or password",
            });
        }
        const currency = {
            id: 2,
            code: "INR",
            symbol: "₹",
            no_of_decimal: 2,
            exchange_rate: "82.00",
            symbol_position: "before_price",
            thousands_separator: "comma",
            decimal_separator: "comma",
            system_reserve: "0",
            status: 1,
            created_by_id: 1,

            deleted_at: null
        }
        let country = await countryModel.findOne({ id: req.body.country_id }).lean({})



        const state = await stateModel.findOne({ id: req.body.state_id });
        let logo = await ImageModel.findOne({ id: req.body.store_logo_id });
        if (!country) {

            return res.status(400);
        }
        const c_name = { collection_name: "attachment" }
        logo = {
            ...logo,
            ...c_name,
        }
        country = {
            ...country,
            ...currency,
        };

        const venders = await userModel.findOne({ email: email }).lean({});
        const roles = await roleModel.findOne({ id: venders.role_id }).lean({});
        const created_by_id = current_user[0].id

        const pivot = {
            model_id: "16",
            role_id: "3",
            model_type: "App\\Models\\User",
        };


        const role = {
            ...roles,
            pivot: pivot,
        };


        const vendor = {
            ...venders,
            role: role,
        };


        const slug = store_name.toLowerCase().trim().replace(/\s+/g, '-');
        const numericId = await generateNumericId();
        const newStore = new storeModel({
            id: numericId,
            store_name,
            slug: slug,
            description,
            country_id,
            state_id,
            state: state,
            city,
            vendor_name: name,    
            created_by_id: created_by_id,
            orders_count: 4,
            reviews_count: 0,
            products_count: 27,
            //product_images: [],
            store_cover: null,
            order_amount: 156.58,
            rating_count: null,
            is_approved: true,
            address,
            pincode,
            name,
            email,
            phone,
            vendor_name: venders.name,
            vendor_id: venders.id,
            store_logo: logo,
            country_code,
            state: state,
            vendor: vendor,
            country: country,
            password,
            store_logo_id,
            hide_vendor_email,
            hide_vendor_phone,
            status,
            facebook,
            instagram,
            pinterest,
            youtube,
            twitter,
        });
        const savedStore = await newStore.save();
        res.status(201).json({ data: savedStore });
    } catch (error) {
        console.error("Error creating store:", error);
        res.status(500).json({ error: "Internal Server Error: Failed to create store" });
    }
};


export const getStores = async (req, res) => {

    try {
        const { page = 1, limit = 10, type } = req.query;
        const query = type ? { type } : {};
        const stores = await storeModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ created_at: -1 })
            .exec();
        const total = await storeModel.countDocuments(query);
        res.status(200).json({
            data: stores,
            total: total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            message: 'An error occurred while fetching tags.',
            error: error.message
        });
    }

}

export const editStore = async (req, res) => {
    const storeId = req.params.id;

    if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    try {
        const store = await storeModel.findOne({ id: storeId }).lean();

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        return res.status(200).json(store);
    } catch (error) {
        console.error("Error fetching store:", error);
        return res.status(500).json({ error: "An error occurred while fetching the store" });
    }
};




export const updateStore = async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: "Invalid request body" });
    }

    try {
        // Fetch current store
        const currentStore = await storeModel.findOne({ id: id });
        if (!currentStore) {
            return res.status(404).json({ error: "Store not found" });
        }

        let updatedUser = null;
        if (data.email && data.name) {
            updatedUser = await userModel.findOneAndUpdate(
                { email: currentStore.email },
                { $set: { name: data.name, email: data.email } },
                { new: true, lean: true }
            );

            if (!updatedUser) {
                console.warn(`User with email ${currentStore.email} not found.`);
            }
        }

        // Validate and fetch additional data
        const logo = data.store_logo_id
            ? await ImageModel.findOne({ id: data.store_logo_id })
            : null;

        const state = data.state_id
            ? await stateModel.findOne({ id: data.state_id })
            : null;

        const country = data.country_id
            ? await countryModel.findOne({ id: data.country_id }).lean()
            : null;

        const vendor = await userModel.findOne({ id: currentStore.vendor_id }).lean();

        if (data.store_logo_id && !logo) {
            return res.status(404).json({ error: "Store logo not found" });
        }
        if (data.state_id && !state) {
            return res.status(404).json({ error: "State not found" });
        }
        if (data.country_id && !country) {
            return res.status(404).json({ error: "Country not found" });
        }
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        // Prepare store data
        const storeData = {
            store_name: data.store_name,
            description: data.description,
            country_id: data.country_id,
            state_id: data.state_id,
            city: data.city,
            address: data.address,
            pincode: data.pincode,
            name: data.name,
            email: data.email,
            phone: data.phone,
            store_logo_id: data.store_logo_id,
            hide_vendor_email: data.hide_vendor_email,
            hide_vendor_phone: data.hide_vendor_phone,
            status: data.status,
            facebook: data.facebook,
            instagram: data.instagram,
            pinterest: data.pinterest,
            youtube: data.youtube,
            twitter: data.twitter,
            store_logo: logo,
            state: state,
            country: country,
            vendor: vendor,
            vendor_name: vendor.name,
        };

        // Update store
        const updatedStore = await storeModel.findOneAndUpdate(
            { id: id },
            { $set: storeData },
            { new: true, lean: true }
        );

        if (!updatedStore) {
            return res.status(404).json({ error: "Store not found after update" });
        }

        // Respond with success
        return res.status(200).json({
            message: "Store and user updated successfully",
            store: updatedStore,
            user: updatedUser || "No user update performed",
        });
    } catch (error) {
        console.error("Error updating store:", error);
        return res.status(500).json({ error: "An error occurred while updating the store" });
    }
};






export const approveStoreStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_approved } = req.body;


        if (!id) {
            console.log(" if (!id) {");
            
            return res.status(400).json({ 
                success: false,
                error: "Store ID is required" 
            });
        }

        if (typeof is_approved !== 'number' || ![0, 1].includes(is_approved)) {
            console.log(" if (typeof is_approved !== 'number' || ![0, 1].includes(is_approved)) {");
         
            return res.status(400).json({ 
                success: false,
                error: "is_approved must be either 0 or 1" 
            });
        }

        const updatedStore = await storeModel.findOneAndUpdate(
            { id: id }, 
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

        if (!updatedStore) {
            return res.status(404).json({ 
                success: false,
                error: "Store not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "Product status updated successfully",
            data: updatedStore 
        });

    } catch (error) {
       
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

        console.error('Error updating product status:', error);

        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};



export const deleteStore = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Store ID is required",
        });
    }

    try {
       
        const deletedStore = await storeModel.findOneAndDelete(
            { id },
            {
                deleted_at: new Date(), 
                status: false, 
            },
            {
                new: true, 
                lean: true, 
            }
        );

        if (!deletedStore) {
            return res.status(404).json({
                success: false,
                error: "Store not found",
            });
        }

        
        return res.status(200).json({
            success: true,
            message: "Store deleted successfully",
            store: deletedStore,
        });
    } catch (error) {
        console.error("Error deleting store:", error);

        return res.status(500).json({
            success: false,
            error: "An error occurred while deleting the store",
        });
    }
};

export const deleteAllStore = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No store IDs provided. Please provide an array of IDs to delete.",
            });
        }

        const deleteResult = await storeModel.deleteMany({ id: { $in: ids } });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No stores found with the provided IDs.",
            });
        }

        res.status(200).json({
            success: true,
            message: `${deleteResult.deletedCount} stores deleted successfully.`,
        });
    } catch (error) {
        console.error(`Error deleting stores: ${error.message}`);
        res.status(500).json({
            success: false,
            message: `An error occurred while deleting stores: ${error.message}`,
        });
    }
};

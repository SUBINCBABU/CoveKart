import currencyModel from "../models/currency_model.js";
import current_user from "./admin_login.js";

const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {
        const lastTag = await currencyModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        // Reset to MIN_ID if MAX_ID is exceeded
        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        // Check for duplicate ID and recursively generate a new one if necessary
        const existingIdTag = await currencyModel.findOne({ id: newId });
        if (existingIdTag) {
            return await generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const createCurrency = async (req, res) => {
    try {
       
        const data = req.body;
        if (!data.code || !data.symbol  || !data.exchange_rate || !data.symbol_position || !data.status) {

            
            return res.status(400).json({ error: "Missing required fields" });
        }

        const numericId = await generateNumericId();
        const currency = new currencyModel({
            id: numericId,
            code: data.code,
            symbol: data.symbol,
            no_of_decimal: data.no_of_decimal,
            exchange_rate: data.exchange_rate,
            symbol_position: data.symbol_position,
            thousands_separator: "comma",
            decimal_separator: "comma",
            system_reserve: "0",
            created_by_id:current_user[0].id,
            status: data.status,
            created_at: new Date(),
            updated_at: new Date(),
        });
     
        await currency.save();

        res.status(201).json({ message: "Currency created successfully", currency });
    } catch (error) {
        console.error(`Error creating currency: ${error.message}`);
        res.status(500).json({ error: `Failed to create currency: ${error.message}` });
    }
};





export const getCurrency = async (req, res) => {
    try {
        const currencies = await currencyModel.find({}).lean();
        res.status(200).json({ data: currencies });
    } catch (error) {
        console.error(`Error fetching currencies: ${error.message}`);
        res.status(500).json({ error: `Failed to fetch currencies: ${error.message}` });
    }
};

export const editCurrency = async (req, res) => {
    try {
        const currencyId = req.params.id;

        // Validate if ID is provided
        if (!currencyId) {
            return res.status(400).json({ error: "Currency ID is required" });
        }

        // Find the currency by ID
        const currency = await currencyModel.findOne({ id: currencyId }).lean();

        if (!currency) {
            return res.status(404).json({ error: "Currency not found" });
        }

        res.status(200).json(currency);
    } catch (error) {
        console.error(`Error fetching currency: ${error.message}`);
        res.status(500).json({ error: `Failed to fetch currency: ${error.message}` });
    }
};

export const updateCurrency = async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;

       
        if (!id) {
            return res.status(400).json({ error: "Currency ID is required" });
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }

       
        const updatedCurrency = await currencyModel.findOneAndUpdate(
            { id: id },
            { $set: data },
            { new: true, lean: true }
        );

        if (!updatedCurrency) {
            return res.status(404).json({ error: "Currency not found" });
        }

        res.status(200).json({ message: "Currency updated successfully", data: updatedCurrency });
    } catch (error) {
        console.error(`Error updating currency: ${error.message}`);
        res.status(500).json({ error: `Failed to update currency: ${error.message}` });
    }
};



export const updateCurrencyStatus = async (req, res) => {
    try {
      
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Currency ID is required" });
        }

        if (status === undefined || status === null) {
            return res.status(400).json({ error: "Status is required" });
        }

        const updatedCurrency = await currencyModel.findOneAndUpdate(
            { id },
            { status, updated_at: new Date() },
            { new: true, lean: true }
        );

        if (!updatedCurrency) {
            return res.status(404).json({ error: "Currency not found" });
        }

        res.status(200).json({ message: "Currency status updated successfully", data: updatedCurrency });
    } catch (error) {
        console.error(`Error updating currency status: ${error.message}`);
        res.status(500).json({ error: `Failed to update currency status: ${error.message}` });
    }
};



export const deleteCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Currency ID is required" });
        }
        const deletedCurrency = await currencyModel.findOneAndDelete(
            { id },
            { deleted_at: new Date(), status: false },
            { new: true, lean: true }
        );
        if (!deletedCurrency) {
            return res.status(404).json({ error: "Currency not found" });
        }

        res.status(200).json({ message: "Currency deleted successfully", data: deletedCurrency });
    } catch (error) {
        console.error(`Error deleting currency: ${error.message}`);
        res.status(500).json({ error: `Failed to delete currency: ${error.message}` });
    }
};


export const deleteAllCurrency = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No currency IDs provided",
            });
        }
        const updateResult = await currencyModel.deleteMany(
            { id: { $in: ids } },
            { 
                status: false,
                deleted_at: new Date(),
            }
        );
        if (updateResult.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No currencies found for the provided IDs",
            });
        }

        res.status(200).json({
            success: true,
            message: `${updateResult.modifiedCount} currencies marked as deleted`,
        });
    } catch (error) {
        console.error(`Error deleting currencies: ${error.message}`);
        res.status(500).json({
            success: false,
            message: `Failed to delete currencies: ${error.message}`,
        });
    }
};

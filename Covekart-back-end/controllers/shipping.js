import countryModel from "../models/country.model.js";
import shippingModel from "../models/shipping_model.js";
import shippingRuleModel from "../models/shippingRule_model.js";
import current_user from "./admin_login.js";

const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {
        const lastTag = await shippingModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        const existingIdTag = await shippingModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const createShipping = async (req, res) => {
    try {
      
        if (!current_user || !current_user[0]) {
            return res.status(403).json({ error: "Unauthorized: No current user available" });
        }

        const { country_id, status } = req.body;

        if (!country_id || !status) {
            return res.status(400).json({ error: "Missing required fields: country_id or status" });
        }

        const country = await countryModel.findOne({ id: country_id });
        if (!country) {
            return res.status(404).json({ error: "Country not found" });
        }
        const exist_shipping = await shippingModel.findOne({ country_id: country_id })
        if (exist_shipping) {
            return res.status(404).json({ error: "error" });
        }
        const numericId = await generateNumericId();

        const shipping = new shippingModel({
            id: numericId,
            created_by_id: current_user[0].id,
            country_id: country_id,
            status: status,
            country: country,
            created_at: new Date(),
            updated_at: new Date(),
            shipping_rules: [],
        });

        const savedShipping = await shipping.save();
        res.status(201).json({
            message: "Shipping created successfully",
            shipping: savedShipping
        });
    } catch (error) {
        console.error(`Error in createShipping: ${error.message}`);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};


export const getShipping = async (req, res) => {
    try {
      const shipping = await shippingModel.find();
      if (!shipping || shipping.length === 0) {
        return res.status(404).json({ message: "No shipping entries found" });
      }
      res.status(200).json(shipping);
    } catch (error) {
      console.error(`Error fetching shipping entries: ${error.message}`);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};
  
export const updateShipping=async(req,res)=>{
    console.log(req.body);
    console.log(req.params);
    
    
}



export const editShipping = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Shipping ID is required" });
      }
  
      const shipping = await shippingModel.findOne({ id });
  
      if (!shipping) {
        return res.status(404).json({ error: "Shipping entry not found" });
      }
  
      res.status(200).json(shipping);
    } catch (error) {
      console.error(`Error fetching shipping entry: ${error.message}`);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  };
  



export const deleteShipping = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: "Shipping ID is required" });
      }
  
      // Find and delete the shipping entry by ID
      const shipping = await shippingModel.findOneAndDelete({ id });
  
      if (!shipping) {
        return res.status(404).json({ error: "Shipping entry not found" });
      }
  
      res.status(200).json({ message: "Shipping entry deleted successfully" });
    } catch (error) {
      console.error(`Error deleting shipping entry: ${error.message}`);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  };
  



  const generateNumericId_rule = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {
        const lastTag = await shippingRuleModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let rule_newId = lastTag ? lastTag.id + 1 : MIN_ID;

        if (rule_newId > MAX_ID) {
            rule_newId = MIN_ID;
        }

        const existingIdTag = await shippingRuleModel.findOne({ id: rule_newId });
        if (existingIdTag) {
            return generateNumericId_rule();
        }

        return rule_newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};


  export const createShippingRule = async (req, res) => {
    try {
  
      const { shipping_id, name, rule_type, min, max, shipping_type, amount, status } = req.body;
      if (!shipping_id || !name || !rule_type || !min || !max || !shipping_type || !amount || !status) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const rule_id= await generateNumericId_rule();
      const shipping_rule = new shippingRuleModel({
        id:rule_id,
        name,
        shipping_id,
        rule_type,
        min,
        max,
        shipping_type,
        amount,
        status,
      });

      const savedShipping_rule = await shipping_rule.save();
      const shippingRules = await shippingRuleModel.find({ shipping_id }).lean();
    
      const updatedShipping = await shippingModel.findOneAndUpdate(
        { id: shipping_id },
        { $set: { shipping_rules: shippingRules } },
        { new: true } 
      );
  
      if (!updatedShipping) {
        return res.status(404).json({ error: "Shipping entry not found" });
      }
  
      res.status(200).json({
        message: "Shipping rule created successfully",
        shipping: updatedShipping,
      });
    } catch (error) {
      console.error(`Error creating shipping rule: ${error.message}`);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  };
  





  export const updateShippingRule = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      if (!id || !data.shipping_id) {
        return res.status(400).json({ error: "Missing required fields: id and shipping_id" });
      }
  
      const shippingRule = await shippingRuleModel.findOneAndUpdate(
        { id },
        { $set: data },
        { new: true } 
      );
  
      if (!shippingRule) {
        return res.status(404).json({ error: "Shipping rule not found" });
      }
  
      const allShippingRules = await shippingRuleModel.find({ shipping_id: data.shipping_id }).lean();
  
      const updatedShipping = await shippingModel.findOneAndUpdate(
        { id: data.shipping_id },
        { $set: { shipping_rules: allShippingRules } },
        { new: true } 
      );
  
      if (!updatedShipping) {
        return res.status(404).json({ error: "Shipping entry not found" });
      }
  
      res.status(200).json({
        message: "Shipping rule updated successfully",
        updatedShipping,
      });
    } catch (error) {
      console.error(`Error updating shipping rule: ${error.message}`);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  };
  


  
  export const deleteShippingRule = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Shipping rule ID is required" });
      }
  
      const shippingRule = await shippingRuleModel.findOne({ id }).lean();
      if (!shippingRule) {
        return res.status(404).json({ error: "Shipping rule not found" });
      }
  
      const shipping_id = shippingRule.shipping_id;
  
      await shippingRuleModel.findOneAndDelete({ id });
      const allShippingRules = await shippingRuleModel.find({ shipping_id }).lean();
      const updatedShipping = await shippingModel.findOneAndUpdate(
        { id: shipping_id },
        { $set: { shipping_rules: allShippingRules } },
        { new: true }
      );
  
      if (!updatedShipping) {
        return res.status(404).json({ error: "Associated shipping entry not found" });
      }
  
      res.status(200).json({
        message: "Shipping rule deleted successfully",
        updatedShipping,
      });
    } catch (error) {
      console.error(`Error deleting shipping rule: ${error.message}`);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  };
  
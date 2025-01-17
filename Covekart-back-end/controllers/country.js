import countryModel from "../models/country.model.js";

export const postCreateCountry = async (req, res) => {
  try {
    
    const {
      id,
      name,
      currency,
      currency_symbol,
      iso_3166_2,
      iso_3166_3,
      calling_code,
      flag,
    } = req.body;

    // Validate required fields
    if (!id ) {
       
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Check if the country already exists
    const existingCountry = await countryModel.findOne({ id });
    if (existingCountry) {
      return res.status(409).json({ message: "Country with this ID already exists" });
    }

    // Create a new country document
    const newCountry = new countryModel({
      id,
      name,
      currency,
      currency_symbol,
      country_id:id,
      created_by_id:1,
      iso_3166_2,
      iso_3166_3,
      calling_code,
      flag,
    });

    // Save the country to the database
    const savedCountry = await newCountry.save();

    res.status(201).json({
      message: "Country created successfully",
      data: savedCountry,
    });
  } catch (error) {
    console.error("Error creating country:", error);
    res.status(500).json({ message: "Failed to create country", error: error.message });
  }
};




export const getCountry = async (req, res) => {
  console.log(req.body);
  
    const countries=await countryModel.find({})
   
    
    res.status(201).json({
      message: "Country fetched successfully",
      data: countries,
    });
  
};

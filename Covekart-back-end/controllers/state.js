import stateModel from "../models/state_model.js";


export const postCreateState = async (req, res) => {
  try {
    
    const states = req.body; 
   
    if (!states) {
      return res.status(400).json({ message: "States array cannot be empty" });
    }

    const invalidState = states.find(
      (state) =>
        !state.id ||
        !state.name ||
        !state.country_id ||
        !state.created_at ||
        !state.updated_at
    );

    if (invalidState) {
      return res.status(400).json({ message: "Each state must contain id, name, country_id, created_at, and updated_at" });
    }

    const result = await stateModel.insertMany(states);   

    res.status(201).json({
      message: "States created successfully",
      data: result,
    });
  } catch (error) {  
    console.error("Error creating states:", error);
    res.status(500).json({ message: "Failed to create states", error: error.message });
  }
};



export const getStates = async (req, res) => {
    
  try {
   
     const  states = await stateModel.find().lean({}); 
    if (states.length === 0) {
      
      return res.status(404).json({ message: "No states found" });
    }

    res.status(200).json({
      message: "States retrieved successfully",
      data: states,
    });
  } catch (error) {
    console.error("Error retrieving states:", error);
    res.status(500).json({
      message: "Failed to retrieve states",
      error: error.message,
    });
  }
};

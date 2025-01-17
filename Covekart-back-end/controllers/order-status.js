import orderStatusModel from "../models/order-status_model.js";

export const createOrderStatus = async (req, res) => {
    try {
      const { data } = req.body;
  
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ message: 'Invalid data format. Expecting an array of order statuses.' });
      }
      const formattedData = data.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        sequence: parseInt(item.sequence, 10),
        created_by_id: parseInt(item.created_by_id, 10),
        status: item.status,
        system_reserve: parseInt(item.system_reserve, 10),
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
        deleted_at: item.deleted_at ? new Date(item.deleted_at) : null,
      }));
      const result = await orderStatusModel.insertMany(formattedData, { ordered: false });
  
      return res.status(201).json({
        message: 'Order statuses created successfully.',
        insertedCount: result.length,
      });
    } catch (error) {
      console.error(error);
  
     
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Some order statuses already exist.' });
      }
  
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
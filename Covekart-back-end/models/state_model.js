import mongoose from "mongoose"

const schema = mongoose.Schema
const stateSchema = new schema({
    id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      country_id: {
        type: Number,
        required: true,
      },
      created_at: {
        type: Date,
        required: true,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        required: true,
        default: Date.now,
      },

})


const stateModel = mongoose.model("State", stateSchema)

export default stateModel
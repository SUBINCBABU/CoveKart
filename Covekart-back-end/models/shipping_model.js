import mongoose from "mongoose"

const schema = mongoose.Schema
const shippingschema = new schema({

    id: { type: Number },
    status: { type: Boolean, default: true },
    country_id: { type: Number },
    created_by_id: { type: Number },
    created_at: { type: Date, required: true, default: Date.now, },
    updated_at: { type: Date, required: true, default: Date.now, },
    deleted_at: { type: Date},
    country: { type: Object },
    shipping_rules: { type: Array }

})


const shippingModel = mongoose.model("Shipping", shippingschema)

export default shippingModel
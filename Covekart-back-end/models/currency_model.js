import mongoose from "mongoose"

const schema = mongoose.Schema
const currencySchema = new schema({
    id: { type: Number, required: true, unique: true },
    code: { type: String, required: true },
    symbol: { type: String, required: true },
    no_of_decimal: { type: Number, required: true },
    exchange_rate: { type: String, required: true },
    symbol_position: { type: String, enum: ['before_price', 'after_price'], required: true },
    thousands_separator: { type: String, required: true },
    decimal_separator: { type: String, required: true },
    system_reserve: { type: String, required: true },
    status: { type: Number, required: true },
    created_by_id: { type: Number, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})


const currencyModel = mongoose.model("Currencies", currencySchema)

export default currencyModel
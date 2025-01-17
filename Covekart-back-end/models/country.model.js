import mongoose from "mongoose"

const schema = mongoose.Schema
const countrySchema = new schema({

    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    currency_symbol:{
        type: String,
       
    },
    flag:{
        type: String,
        required: true,
    },
    calling_code:{
        type: String,
        required: true,
    },
    iso_3166_2:{
        type: String,
        required: true,
    },
       iso_3166_3:{
        type: String,
        required: true,
    },
    country_id: {
        type: Number,
        required: true,
    },
    created_by_id: {
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
    deleted_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
})


const countryModel = mongoose.model("Country", countrySchema)

export default countryModel
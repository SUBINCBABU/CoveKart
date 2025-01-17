import mongoose from "mongoose"

const schema = mongoose.Schema
const storeSchema = new schema({
  id: { type: Number, required: true },
  store_name: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String },
  store_logo_id: { type: Number, required: true },
  store_cover_id: { type: String, default: null },
  country_id: { type: Number, required: true },
  state_id: { type: Number, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: Number, required: true },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  pinterest: { type: String, default: '' },
  youtube: { type: String, default: '' },
  twitter: { type: String, default: '' },
  hide_vendor_email: { type: Boolean, default: false },
  hide_vendor_phone: { type: Boolean, default: false },
  vendor_id: { type: Number },
  vendor_name:{type: String},
  created_by_id: { type: Number },
  status: { type: Boolean, default: true },
  is_approved: { type: Boolean, default: true },
  orders_count: { type: Number },
  reviews_count: { type: Number },
  products_count: { type: Number },
  //product_images: [],
  order_amount: { type: Number },
  rating_count: { type: Boolean, default: null },
  store_logo: {},
  store_cover: { type: Boolean, default: null },

  vendor: {},
  country: {},
  state: {},
  // reviews: [],
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  country_code: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
},
  {
    timestamps: true,
  }
);

storeSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});


const storeModel = mongoose.model("store", storeSchema)

export default storeModel
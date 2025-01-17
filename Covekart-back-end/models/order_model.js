import mongoose from "mongoose"

const schema = mongoose.Schema

const OrderSchema = new schema({

  id: { type: Number, required: true },
  order_number: { type: Number, required: true },
  consumer_id: { type: Number, required: true },
  tax_total: { type: Number, default: 0 },
  shipping_total: { type: Number, default: 0 },
  points_amount: { type: Number, default: 0 },
  wallet_balance: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  coupon_total_discount: { type: Number, default: 0 },
  payment_method: { type: String, required: true },
  payment_status: { type: String,},
  store_id: { type: Array, required: true },
  billing_address_id: { type: Number, required: true },
  shipping_address_id: { type: Number, required: true },
  delivery_description: { type: String },
  delivery_interval: { type: String, default: null },
  order_status_id: { type: Number},
  coupon_id: { type: Number, default: null },
  parent_id: { type: Number, default: null },
  created_by_id: { type: Number,},
  invoice_url: { type: String, default: '' },
  status: { type: Number, default: 1 },
  delivered_at: { type: Date, default: null },
  consumer: {},
  store: {},
  products: [],
  billing_address: {},
  shipping_address: {},
  order_status: {},
  sub_orders: [],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});
const orderModel = mongoose.model("Orders", OrderSchema)

export default orderModel
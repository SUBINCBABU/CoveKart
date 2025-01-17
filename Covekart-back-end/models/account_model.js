import mongoose from "mongoose";

const schema = mongoose.Schema;

// Define the schema for permissions
const permissionSchema = new schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  guard_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  pivot: {
    role_id: { type: Number, required: true },
    permission_id: { type: Number, required: true },
  },
});

// Define the schema for roles
const roleSchema = new schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  guard_name: { type: String, required: true },
  system_reserve: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  pivot: {
    model_id: { type: Number, required: true },
    role_id: { type: Number, required: true },
    model_type: { type: String, required: true },
  },
});

// Define the schema for payment account
const paymentAccountSchema = new schema({
  id: { type: Number, required: true },
  user_id: { type: String, required: true },
  paypal_email: { type: String, default: null },
  bank_name: { type: String, default: null },
  bank_holder_name: { type: String, default: null },
  bank_account_no: { type: String, default: null },
  swift: { type: String, default: null },
  ifsc: { type: String, default: null },
  is_default: { type: String, default: '0' },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

// Main schema for account
const accountSchema = new schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password:{type:String},
    country_code: { type: String, required: true },
    phone: { type: Number, required: true },
    profile_image_id: { type: Number, default: null },
    system_reserve: { type: String, default: '1' },
    status: { type: Number, default: 1 },
    created_by_id: { type: Number, required: true },
    email_verified_at: { type: Date, default: null },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    deleted_at: { type: Date, default: null },
    orders_count: { type: Number, default: 0 },
    role: roleSchema, // Embedded role document
    permission: [permissionSchema], // Embedded permissions array
    store: { type: String, default: null },
    point: { type: Number, default: null },
    wallet: { type: String, default: null },
    address: { type: [String], default: [] },
    vendor_wallet: { type: String, default: null },
    profile_image: { type: Object, default: null },
    payment_account: paymentAccountSchema, // Embedded payment account document
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;

import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
    id:{type:Number},
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    min_spend: { type: Number, required: true },
    is_unlimited: { type: Boolean, default: false },
    usage_per_coupon: { type: Number, default: 0 },
    usage_per_customer: { type: Number, default: 1 },
    used: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    is_expired: { type: Boolean, default: false },
    is_apply_all: { type: Boolean, default: false },
    is_first_order: { type: Boolean, default: false },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    created_by_id: { type: Number },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null},
    deleted_at: { type: Date, default: null }
})

export const CouponModel = mongoose.model("Coupons", couponSchema)

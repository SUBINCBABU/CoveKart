import { CouponModel } from "../models/coupon_model.js";
import ImageModel from "../models/images_model.js"
import Account from '../models/account_model.js';
import current_user from "./admin_login.js";


const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {

        const lastTag = await CouponModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;

        if (newId > MAX_ID) {
            newId = MIN_ID;
        }

        const existingIdTag = await CouponModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const getCoupons = async (req, res) => {

    try {
        const coupens = await CouponModel.find({}).lean({})
        res.status(200).json({
            data: coupens,
            message: "coupens fetched successfully",
        });

    } catch (error) {
        console.error("Error fetching coupon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const createCoupons = async (req, res) => {
    try {
        const couponId = await generateNumericId();

        const user = await Account.findOne({ id: current_user[0].id }).lean({})

        const coupon = new CouponModel({
            id: couponId,
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            amount: req.body.amount,
            is_first_order: req.body.is_first_order,
            status: req.body.status,
            is_apply_all: req.body.is_apply_all,
            type: req.body.type,
            created_by_id: user.id,
            is_expired: req.body.is_expired,
            is_unlimited: req.body.is_unlimited,
            min_spend: req.body.min_spend,
            usage_per_coupon: req.body.usage_per_coupon,
            usage_per_customer: req.body.usage_per_customer,
            used: req.body.used,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        });
        await coupon.save();

        return res.status(200).json({
            message: "coupon added successfully",
        });
    } catch (error) {
        console.error("Error saving coupon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCouponStatus = async (req, res) => {
    try {
        const coupon = await CouponModel.findOneAndUpdate({ id: req.params.id },
            { status: req.body.status },
            { new: true }
        ).lean({})
        res.status(200).json({
            data: coupon,
            message: "coupon Status updated successfully",
        });
    } catch (error) {
        console.error("Error updating coupon status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const EditCoupon = async (req, res) => {
    try {
      
        const result = await CouponModel.findOne({ id: req.params.id })
        res.status(200).json(result);
    } catch (error) {
        console.error("Error Edit coupon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const UpdateCoupons = async (req, res) => {
    try {
       
        const couponUpdateData = {

            $set: {
                title: req.body.title,
                description: req.body.description,
                code: req.body.code,
                amount: req.body.amount,
                is_first_order: req.body.is_first_order,
                status: req.body.status,
                is_apply_all: req.body.is_apply_all,
                type: req.body.type,
                is_expired: req.body.is_expired,
                is_unlimited: req.body.is_unlimited,
                min_spend: req.body.min_spend,
                usage_per_coupon: req.body.usage_per_coupon,
                usage_per_customer: req.body.usage_per_customer,
                used: req.body.used,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                updated_at: new Date()
            }
        }

        const coupon = await CouponModel.findOneAndUpdate({ id: req.params.id },
            couponUpdateData,
            { new: true }
        ).lean({})
       
        res.status(200).json({
            data: coupon,
            message: "coupon updated successfully",
        });
    } catch (error) {
        console.error("Error update coupon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const DeleteCoupons = async (req, res) => {
    try {
        await CouponModel.findOneAndDelete(req.params.id).lean({})
        res.status(200).json({
            message: "coupon deleted successfully",
        });
    } catch (error) {
        console.error("Error DeleteCoupons:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteAllCoupons = async (req, res) => {
    try {
        let ids = req.body.ids
        await CouponModel.deleteMany({ id: { $in: ids } }).lean({})
        res.status(200).json({
            message: "All coupon deleted successfully",
        });
    } catch (error) {
        console.error("Error DeleteAllCoupons:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

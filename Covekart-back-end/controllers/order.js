import orderModel from "../models/order_model.js";
import storeModel from "../models/store_model.js";
import ProductModel from "../models/product_model.js";
//import DatatatusModel from "../models/order-status_model.js";
import userModel from "../models/user_Model.js";
import userAddressModel from "../models/userAddress_Model.js";
import { current_user } from "./user_controller.js";
import shippingRuleModel from "../models/shippingRule_model.js";
import shippingModel from "../models/shipping_model.js";
import { CouponModel } from "../models/coupon_model.js";
import { DataSessionPage } from "twilio/lib/rest/wireless/v1/sim/dataSession.js";

const generateNumericId = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {

        const lastTag = await orderModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MIN_ID;
        if (newId > MAX_ID) {
            newId = MIN_ID;
        }
        const existingIdTag = await orderModel.findOne({ id: newId });
        if (existingIdTag) {
            return generateNumericId();
        }
        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

const generateOrderNumber = async () => {
    const MIN_ID = 10000;
    const MAX_ID = Number.MAX_SAFE_INTEGER;

    try {

        const lastTag = await orderModel.findOne({}, { order_number: 1 }).sort({ order_number: -1 });
        let newNumber = lastTag ? lastTag.order_number + 1 : MIN_ID;
        if (newNumber > MAX_ID) {
            newNumber = MIN_ID;
        }
        const existingIdTag = await orderModel.findOne({ order_number: newNumber });
        if (existingIdTag) {
            return generateOrderNumber();
        }
        return newNumber;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};

export const getOrders = async (req, res) => {
    try {
        const user = await userModel.findOne({ id: current_user[0].id });
        if (!user) {
            return res.status(404).json({
                data: null,
                message: "User not found"
            });
        }
        if (user) {
            const data = await orderModel.find({ consumer_id: user.id }).lean({})
            const total = data.length
            const result = {
                data: data,
                total: total,
                current_page: 1
            }
            res.status(200).json(result);
        }

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred during getData",
            error: error.message
        });
    }
}

export const viewOrder = async (req, res) => {
    try {
       
        const user = await userModel.findOne({ id: current_user[0].id });
        if (!user) {
            return res.status(404).json({
                data: null,
                message: "User not found"
            });
        }
        if (user) {
            const data = await orderModel.find({
                $or: [{ order_number: req.params.id },
                { consumer_id: current_user[0].id }]
            }).lean({})
            const total = data.length
            const result = {
                data: data,
                total: total,
                current_page: 1
            }
            res.status(200).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred during viewOrder",
            error: error.message
        });
    }
}

export const orderCheckout = async (req, res) => {
    try {
        const { products, coupon: coupon_code } = req.body;

        if (!products?.length) {
            return res.status(400).json({ message: "Products list cannot be empty" });
        }

        let sub_total = 0;
        let tax_total = 0;

        for (const item of products) {
            const product = await ProductModel.findOne({ id: item.product_id });

            if (!product) {
                return res.status(404).json({
                    message: `Product with ID ${item.product_id} not found`
                });
            }

            const price = product.sale_price;
            const tax = (price * product.tax.rate) / 100

            sub_total = (sub_total + price) * item.quantity;
            tax_total = (tax_total + tax) * item.quantity

        }

        const user = await userModel.findOne({ id: current_user[0].id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const shipping = await shippingModel.findOne({}).lean();
        if (!shipping) {
            return res.status(404).json({ message: "Shipping information not found" });
        }

        const shipping_rule = await shippingRuleModel.findOne({ shipping_id: shipping.id });
        if (!shipping_rule) {
            return res.status(404).json({ message: "Shipping rule not found" });
        }

        const shipping_total = shipping_rule.amount;
        let total = sub_total + tax_total + shipping_total;
        let coupon_total_discount = 0;

        if (coupon_code) {
            const coupon = await CouponModel.findOne({ code: coupon_code });

            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            const currentDate = new Date();
            const isValidCoupon =
                coupon.status &&
                coupon.is_expired &&
                (coupon.is_unlimited || coupon.used < coupon.usage_per_coupon) &&
                coupon.min_spend <= total &&
                currentDate >= new Date(coupon.start_date) &&
                currentDate <= new Date(coupon.end_date);
            if (isValidCoupon) {
                switch (coupon.type) {
                    case 'fixed':
                        coupon_total_discount = coupon.amount;
                        break;
                    case 'percentage':
                        coupon_total_discount = (total * coupon.amount) / 100;
                        break;
                    case 'free_shipping':
                        coupon_total_discount = shipping_total;
                        break;
                    default:
                        console.warn(`Unhandled coupon type: ${coupon.type}`);
                }
            } else {

                return res.status(400).json({
                    message: "Coupon is not valid",
                    reasons: {
                        status: !coupon.status ? "Coupon is inactive" : null,
                        expired: coupon.is_expired ? "Coupon is expired" : null,
                        usage: (!coupon.is_unlimited && coupon.used >= coupon.usage_per_coupon) ? "Coupon usage limit exceeded" : null,
                        minSpend: coupon.min_spend > total ? "Minimum spend requirement not met" : null,
                        dateValid: (currentDate < new Date(coupon.start_date) || currentDate > new Date(coupon.end_date)) ? "Coupon is not valid for current date" : null
                    }
                });
            }
        }
        const checkoutTotal = {
            sub_total,
            tax_total,
            shipping_total,
            coupon_total_discount,
            total: total - coupon_total_discount
        };

        return res.status(200).json({ total: checkoutTotal });

    } catch (error) {
        console.error("Error during checkout:", error);
        return res.status(500).json({
            message: "An error occurred during checkout",
            error: error.message
        });
    }
};

export const placeOrder = async (req, res) => {

    try {
        const data = req.body;
        console.log("placeOrder::", data);

        if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
            return res.status(400).json({ message: "Products are required" });
        }
        if (!data.shipping_address_id || !data.billing_address_id) {
            return res.status(400).json({ message: "Shipping and billing address IDs are required" });
        }

        const [shippingAddress, billingAddress] = await Promise.all([
            userAddressModel.findOne({ id: data.shipping_address_id }).lean(),
            userAddressModel.findOne({ id: data.billing_address_id }).lean(),
        ]);


        if (!shippingAddress || !billingAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        const consumer = await userModel.findOne({ id: current_user[0].id }).lean();
        if (!consumer) {
            return res.status(404).json({ message: "Consumer not found" });
        }


        let subTotal = 0;
        let taxTotal = 0;

        for (const item of data.products) {

            const product = await ProductModel.findOne({ id: item.product_id }).lean();
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
            }


            const price = product.sale_price;
            const tax = (price * product.tax.rate) / 100

            subTotal = (subTotal + price) * item.quantity;
            taxTotal = (taxTotal + tax) * item.quantity;
        }
        const shipping = await shippingModel.findOne({}).lean();
        if (!shipping) {
            return res.status(404).json({ message: "Shipping information not found" });
        }

        const shippingRule = await shippingRuleModel.findOne({ shipping_id: shipping.id }).lean();


        if (!shippingRule) {
            return res.status(404).json({ message: "Shipping rule not found" });
        }

        const shippingTotal = shippingRule.amount;
        let total = subTotal + taxTotal + shippingTotal;
        let couponTotalDiscount = 0;
        let couponID = null;
         
        if (data.coupon) {
            const coupon = await CouponModel.findOne({ code: data.coupon }).lean();
            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            const currentDate = new Date();
            const isValidCoupon =
                coupon.status &&
                coupon.is_expired &&
                (coupon.is_unlimited || coupon.used < coupon.usage_per_coupon) &&
                coupon.min_spend <= total &&
                currentDate >= new Date(coupon.start_date) &&
                currentDate <= new Date(coupon.end_date);
            console.log("isValidCoupon-isValidCoupon===", isValidCoupon);

            if (isValidCoupon) {
                switch (coupon.type) {
                    case "fixed":
                        couponTotalDiscount = coupon.amount;
                        break;
                    case "percentage":
                        couponTotalDiscount = (total * coupon.amount) / 100;
                        break;
                    case "free_shipping":
                        couponTotalDiscount = shippingTotal;
                        break;
                    default:
                        console.warn(`Unhandled coupon type: ${coupon.type}`);
                }
                couponID = coupon.id;
            } else {
                return res.status(400).json({ message: "Coupon is not valid" });
            }
        }
        const checkoutTotal = {
            subTotal,
            taxTotal,
            shippingTotal,
            couponTotalDiscount,
            total: total - couponTotalDiscount,
        };
        console.log("checkoutTotal-checkoutTotal==", checkoutTotal);

        const productIds = data.products.map(product => product.product_id);
        const prod = await ProductModel.find({ id: { $in: productIds } }).lean({})
        const products = await ProductModel.find(
            { id: { $in: productIds } },
            { store_id: 1, store: 1 }
        ).lean();

        const storeIds = [...new Set(products.map(product => product.store_id))];
        const stores = await storeModel.find({ id: { $in: storeIds } }).lean();
        const orderId = await generateNumericId();
        const orderNo = await generateOrderNumber()
        const order = new orderModel({
            id: orderId,
            shipping_address_id: data.shipping_address_id,
            billing_address_id: data.billing_address_id,
            delivery_description: data.delivery_description,
            payment_method: data.payment_method,
            delivery_interval: data.delivery_interval,
            points_amount: data.points_amount,
            wallet_balance: data.wallet_balance,
            coupon: data.coupon,
            consumer_id: consumer.id,
            consumer: consumer,
            products: prod,
            shipping_address: shippingAddress,
            billing_address: billingAddress,
            store: stores,
            store_id: storeIds,
            order_number: orderNo,
            tax_total: checkoutTotal.taxTotal,
            shipping_total: shippingTotal,
            amount: checkoutTotal.subTotal,
            total: checkoutTotal.total,
            parent_id: data.parent_id,
            created_by_id: data.created_by_id,//product.created_by_id
            coupon_total_discount: checkoutTotal.couponTotalDiscount,
            coupon_id: couponID,
            status: 1,
            sub_Data: [],
            payment_status: "COMPLETED",
            order_status_id: 1,
            order_status: {
                "id": 1,
                "name": "pending",
                "slug": "pending",
                "sequence": "1",
                "created_by_id": "1",
                "status": 1,
                "system_reserve": "1",
                "created_at": "2023-08-24T08:16:03.000000Z",
                "updated_at": "2023-08-24T08:16:03.000000Z",
                "deleted_at": null
            },
        });
        const savedOrder = await order.save();
        if (savedOrder) {
            await userModel.findOneAndUpdate(
                { id: consumer.id },
                { $inc: { Data_count: 1 } },
                { new: true, lean: true }
            );
            for (const item of data.products) {
                const product = await ProductModel.findOne({ id: item.product_id }).lean();
                const productUpdateData = {
                    order_id: savedOrder.id,
                    product_id: item.product_id,
                    variation_id: item.variation_id,
                    quantity: item.quantity,
                    single_price: product.sale_price,
                    shipping_cost: 0,
                    subtotal: (item.quantity) * (product.sale_price),
                    is_refunded: 0,
                }
                const updatedproduct = await ProductModel.findOneAndUpdate({ id: item.product_id },
                    { $set: { pivot: productUpdateData } },
                    { new: true }
                ).lean({})
                console.log("updatedproduct:-", updatedproduct.pivot);
                const Data = await orderModel.findOneAndUpdate(
                    { id: savedOrder.id, "products.product_id": item.product_id },
                    { $set: { "products.$.pivot": productUpdateData } },
                    { new: true }
                );
                console.log("updated-Data.product.pivot", Data);

            }
        }
        return res.status(200).json({
            data: savedOrder,
            message: "Order placed successfully",
        });
    } catch (error) {
        console.error("Error in placeOrder:", error);
        return res.status(500).json({ error: "An error occurred while placing the order" });
    }
};




export const adminGetOrder=async(req,res)=>{
   const data=await orderModel.find({}).lean()
  
   
   res.status(200).json(data)
}
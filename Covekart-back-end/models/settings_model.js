import mongoose from "mongoose"

const schema = mongoose.Schema
const settingsschema = new schema({
    values: {
        general: {
            light_logo_image_id: Number,
            dark_logo_image_id: Number,
            tiny_logo_image_id: Number,
            favicon_image_id: Number,
            site_title: String,
            site_tagline: String,
            default_timezone: String,
            default_currency_id: Number,
            admin_site_language_direction: String,
            min_order_amount: Number,
            min_order_free_shipping: Number,
            product_sku_prefix: String,
            mode: String,
            copyright: String,
            light_logo_image: Object,
            dark_logo_image: Object,
            favicon_image: Object,
            tiny_logo_image: Object,
            default_currency: Object
        },
        newsletter: { 
            status: Boolean,
             mailchip_api_key: String,
             mailchip_list_id: String },
        vendor_commissions: {
            status:Boolean,
            min_withdraw_amount: Number,
            default_commission_rate: Number,
            is_category_based_commission: Boolean
          },
        activation: {
            multivendor: Boolean,
            point_enable: Boolean,
            coupon_enable: Boolean,
            wallet_enable: Boolean,
            stock_product_hide: Boolean,
            store_auto_approve: Boolean,
            product_auto_approve: Boolean
        },
        wallet_points: {
            signup_points: Number,
            min_per_order_amount: Number,
            point_currency_ratio: Number,
            reward_per_order_amount: Number
        },
        analytics: {
            facebook_pixel: {
                status: Boolean,
                pixel_id: String
            },
            google_analytics: {
                measurement_id: String
            }
        },
        google_reCaptcha: {
             status: Boolean, 
             secret: String,
            site_key: String 
            },
        refund: { 
            status: Boolean, 
            refundable_days: Number
         },
        delivery: {
            default_delivery: Number,
            default: {
                title: String,
                description: String
            },
            same_day_delivery: Boolean,
            same_day: {
                title: String,
                description: String
            },
            same_day_intervals: [
                {
                    title: String,
                    description: String
                }
            ]
        },
        maintenance: {
            title: String,
            maintenance_mode: Boolean,
            maintenance_image_id: Number,
            description: String,
            maintenance_image: Object
        },
        payment_methods: [
            {
                name: String,
                status: Boolean
            }
        ]
    }

    })


const settingsModel = mongoose.model("settings", settingsschema)

export default settingsModel
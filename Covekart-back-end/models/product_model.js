import mongoose from "mongoose";
const { Schema } = mongoose;


const VariantSchema = new Schema({
    id: {
        type: Number,
        index: true
    },
    attribute_values: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    options: {
        type: Schema.Types.Mixed,
        default: null
    },
    variant_option: {
        type: Schema.Types.Mixed,
        default: null
    }
}, { _id: false });

const ProductSchema = new Schema({
    // Basic Information
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    short_description: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },

    // Store and Category Information
    store_id: {
        type: Number,
        required: true,
        index: true
    },
    store: {
        type: Schema.Types.Mixed,
        default: null
    },
    categories: {
        type: Schema.Types.Mixed,
        default: null
    },

    // Product Type and Stock
    type: {
        type: String,
        enum: ["simple", "variable"],
        required: true,
        index: true
    },
    unit: {
        type: String,
        trim: true
    },
    weight: {
        type: Number,
        min: 0
    },
    stock_status: {
        type: String,
        required: true,
        enum: ["in_stock", "out_of_stock", "on_backorder"],
        index: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },

    // Pricing
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    sale_price: {
        type: Number,
        default: 0,
        min: 0
    },
    is_sale_enable: {
        type: Boolean,
        default: false
    },
    sale_starts_at: {
        type: Date,
        default: null
    },
    sale_expired_at: {
        type: Date,
        default: null
    },

    // Tax and Shipping
    tax: {
        type: Schema.Types.Mixed,
        default: null
    },
    tax_id: {
        type: Number,
        ref: "Tax",
        index: true
    },
    is_free_shipping: {
        type: Boolean,
        default: false
    },

    // Tags and Attributes
    tags: {
        type: Schema.Types.Mixed,
        default: null
    },
    attributes: {
        type: Schema.Types.Mixed,
        default: null
    },
    attributes_ids: [{
        type: Number,
        ref: "Attribute"
    }],

    // Related Products
    is_random_related_products: {
        type: Boolean,
        default: false
    },
    related_products: [{
        type: Number,
        ref: "Product"
    }],
    cross_sell_products: [{
        type: Number,
        ref: "Product",
        default: null
    }],

    // Images
    product_thumbnail_id: {
        type: Number,
        default: null
    },
    product_thumbnail: {
        type: Schema.Types.Mixed,
        default: null
    },
    product_galleries_id: [{
        type: Number
    }],
    product_galleries: {
        type: Schema.Types.Mixed,
        default: null
    },
    size_chart_image_id: {
        type: Number
    },
    size_chart_image: {
        type: Schema.Types.Mixed,
        default: null
    },

    // Variants
    variants: [VariantSchema],
    variations: {
        type: [Schema.Types.Mixed],
        default: []
    },

    // SEO and Meta
    meta_title: {
        type: String,
        trim: true
    },
    meta_description: {
        type: String,
        trim: true
    },
    product_meta_image_id: {
        type: Number
    },
    product_meta_image: {
        type: Schema.Types.Mixed,
        default: null
    },

    // Features and Settings
    safe_checkout: {
        type: Boolean,
        default: false
    },
    secure_checkout: {
        type: Boolean,
        default: false
    },
    social_share: {
        type: Boolean,
        default: false
    },
    encourage_order: {
        type: Boolean,
        default: false
    },
    encourage_view: {
        type: Boolean,
        default: false
    },
    estimated_delivery_text: {
        type: String,
        trim: true
    },
    return_policy_text: {
        type: String,
        trim: true
    },


    is_featured: {
        type: Boolean,
        default: false
    },
    is_trending: {
        type: Boolean,
        default: false
    },
    is_return: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    is_approved:{
        type: Boolean,
        default: false
    },

    review_ratings: {
        type: [Number],
        default: [0, 0, 0, 0, 0],
        validate: {
            validator: function (arr) {
                return arr.length === 5 && arr.every(num => num => 0 && num <= 5)

            },
            message: "review_rating must be an array"
        }

    },
    pivot:{},
    review_count: { type: Number, default: 0 },
    reviews: [],
    user_review: [],
    can_review: { type: Boolean, default: true },
    rating_count: { type: Number, default: 0 }


},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });


ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ sale_price: 1 });


ProductSchema.pre('save', function (next) {
    if (this.sale_price > this.price) {
        this.sale_price = this.price;
    }
    next();
});


ProductSchema.pre('save', function (next) {
    if (this.is_sale_enable) {
        if (this.sale_starts_at && this.sale_expired_at) {
            if (this.sale_starts_at >= this.sale_expired_at) {
                next(new Error('Sale start date must be before sale end date'));
            }
        }
    }
    next();
});

const ProductModel = mongoose.model("products", ProductSchema);

export default ProductModel;
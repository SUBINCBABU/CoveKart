import mongoose from "mongoose";

const redirectLinkSchema = new mongoose.Schema({
    link: { type: String, required: true },
    link_type: { type: String, required: true },
});

const bannerSchema = new mongoose.Schema({
    image_url: { type: String, required: true },
    redirect_link: { type: redirectLinkSchema, required: true },
});

const sliderProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    product_ids: { type: [Number], required: true },
    status: { type: Boolean, required: true },
});

const RomeThemeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    content: {
        home_banner: {
            status: { type: Boolean, required: true },
            bg_image_url: { type: String, required: true },
            main_banner: { type: bannerSchema, required: true },
            sub_banner_1: { type: bannerSchema, required: true },
            sub_banner_2: { type: bannerSchema, required: true },
            sub_banner_3: { type: bannerSchema, required: true },
        },
        categories_image_list: {
            title: { type: String, required: true },
            category_ids: { type: [Number], required: true },
            status: { type: Boolean, required: true },
        },
        value_banners: {
            title: { type: String, required: true },
            status: { type: Boolean, required: true },
            banners: [{}],
        },
        categories_products: {
            title: { type: String, required: true },
            status: { type: Boolean, required: true },
            category_ids: { type: [Number], required: true },
        },
        two_column_banners: {
            status: { type: Boolean, required: true },
            banner_1: { type: bannerSchema, required: true },
            banner_2: { type: bannerSchema, required: true },
        },
        slider_products: {
            status: { type: Boolean, required: true },
            product_slider_1: { type: sliderProductSchema, required: true },
            product_slider_2: { type: sliderProductSchema, required: true },
            product_slider_3: { type: sliderProductSchema, required: true },
            product_slider_4: { type: sliderProductSchema, required: true },
        },
        full_width_banner: {
            redirect_link: { type: redirectLinkSchema, required: true },
            image_url: { type: String, required: true },
            status: { type: Boolean, required: true },
        },
        products_list_1: {
            title: { type: String, required: true },
            status: { type: Boolean, required: true },
            product_ids: { type: [Number], required: true },
        },
        featured_blogs: {
            title: { type: String, required: true },
            status: { type: Boolean, required: true },
            blog_ids: { type: [Number], required: true },
        },
        news_letter: {
            title: { type: String, required: true },
            sub_title: { type: String, required: true },
            image_url: { type: String, required: true },
            status: { type: Boolean, required: true },
        },
        products_ids: { type: [Number], required: true },
    },
    slug: { type: String, required: true, unique: true },
});

const RomeThemeModel = mongoose.model("RomeTheme", RomeThemeSchema);

export default RomeThemeModel; 


import mongoose from "mongoose"
import { type } from "os"

const schema = mongoose.Schema
const themeOptionschema = new schema({
  id: { type: Number, required: true },
    options: {
        general: {
            site_title: { type: String, required: true },
            site_tagline: { type: String, required: true },
            cart_style: { type: String, required: true },
            back_to_top_enable: { type: Boolean, required: true },
            language_direction: { type: String, required: true },
            primary_color: { type: String, required: true },
            mode: { type: String, required: true }
        },
        logo: {
            header_logo_id: { type: Number, required: true },
            footer_logo_id: { type: Number, required: true },
            favicon_icon_id: { type: Number, required: true },
            favicon_icon: {
                id: { type: Number, required: true },
                collection_name: { type: String, required: true },
                name: { type: String, required: true },
                file_name: { type: String, required: true },
                mime_type: { type: String, required: true },
                disk: { type: String, required: true },
                conversions_disk: { type: String, required: true },
                size: { type: String, required: true },
                created_by_id: { type: String },
                created_at: { type: Date, required: true },
                updated_at: { type: Date, required: true },
                original_url: { type: String, required: true }
            },
            header_logo: {
                id: { type: Number, required: true },
                collection_name: { type: String, required: true },
                name: { type: String, required: true },
                file_name: { type: String, required: true },
                mime_type: { type: String, required: true },
                disk: { type: String, required: true },
                conversions_disk: { type: String, required: true },
                size: { type: String, required: true },
                created_by_id: { type: String },
                created_at: { type: Date, required: true },
                updated_at: { type: Date, required: true },
                original_url: { type: String, required: true }
            },
            footer_logo: {
                id: { type: Number, required: true },
                collection_name: { type: String, required: true },
                name: { type: String, required: true },
                file_name: { type: String, required: true },
                mime_type: { type: String, required: true },
                disk: { type: String, required: true },
                conversions_disk: { type: String, required: true },
                size: { type: String, required: true },
                created_by_id: { type: String },
                created_at: { type: Date, required: true },
                updated_at: { type: Date, required: true },
                original_url: { type: String, required: true }
            }
        },
        header: {
            sticky_header_enable: { type: Boolean, required: true },
            header_options: { type: String, required: true },
            page_top_bar_enable: { type: Boolean, required: true },
            top_bar_content: [
                {
                    content: { type: String, required: true }
                }
            ],
            page_top_bar_dark: { type: Boolean, required: true },
            support_number: { type: String, required: true },
            today_deals: [Number],
            category_ids: [Number]
        },
        footer: {
            footer_style: { type: String, required: true },
            footer_copyright: { type: Boolean, required: true },
            copyright_content: { type: String, required: true },
            footer_about: { type: String, required: true },
            about_address: { type: String, required: true },
            about_email: { type: String, required: true },
            footer_categories: [Number],
            help_center: [
                {
                    label: { type: String, required: true },
                    link: { type: String, required: true }
                }
            ],
            useful_link: [
                {
                    label: { type: String, required: true },
                    link: { type: String, required: true }
                }
            ],
            support_number: { type: String, required: true },
            support_email: { type: String, required: true },
            play_store_url: { type: String, required: true },
            app_store_url: { type: String, required: true },
            social_media_enable: { type: Boolean, required: true },
            facebook: { type: String, required: true },
            instagram: { type: String, required: true },
            twitter: { type: String, required: true },
            pinterest: { type: String, required: true }
        },
        collection: {
            collection_layout: { type: String, required: true },
            collection_banner_image_url: { type: String, required: true }
        },
        product: {
            product_layout: { type: String, required: true },
            is_trending_product: { type: Boolean, required: true },
            banner_enable: { type: Boolean, required: true },
            banner_image_url: { type: String, required: true },
            safe_checkout: { type: Boolean, required: true },
            safe_checkout_image: { type: String, required: true },
            secure_checkout: { type: Boolean, required: true },
            secure_checkout_image: { type: String, required: true },
            encourage_order: { type: Boolean, required: true },
            encourage_max_order_count: { type: Number, required: true },
            encourage_view: { type: Boolean, required: true },
            encourage_max_view_count: { type: Number, required: true },
            sticky_checkout: { type: Boolean, required: true },
            sticky_product: { type: Boolean, required: true },
            social_share: { type: Boolean, required: true },
            shipping_and_return: { type: String, required: true }
        },
        blog: {
            blog_style: { type: String, required: true },
            blog_sidebar_type: { type: String, required: true },
            blog_author_enable: { type: Boolean, required: true },
            read_more_enable: { type: Boolean, required: true }
        },
        seller: {
            about: {
                status: { type: Boolean, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                image_url: { type: String, required: true }
            },
            services: {
                status: { type: Boolean, required: true },
                service_1: {
                    title: { type: String, required: true },
                    description: { type: String, required: true },
                    image_url: { type: String, required: true }
                },
                service_2: {
                    title: { type: String, required: true },
                    description: { type: String, required: true },
                    image_url: { type: String, required: true }
                },
                service_3: {
                    title: { type: String, required: true },
                    description: { type: String, required: true },
                    image_url: { type: String, required: true }
                },
                service_4: {
                    title: { type: String, required: true },
                    description: { type: String, required: true },
                    image_url: { type: String, required: true }
                }
            },
            steps: {
                status: { type: Boolean, required: true },
                title: { type: String, required: true },
                step_1: {
                    title: { type: String, required: true },
                    description: { type: String, required: true }
                },
                step_2: {
                    title: { type: String, required: true },
                    description: { type: String, required: true }
                },
                step_3: {
                    title: { type: String, required: true },
                    description: { type: String, required: true }
                }
            },
            start_selling: {
                status: { type: Boolean, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true }
            },
            store_layout: { type: String, required: true },
            store_details: { type: String, required: true }
        },
        contact_us: {
            contact_image_url: { type: String, required: true },
            detail_1: {
                label: { type: String, required: true },
                icon: { type: String, required: true },
                text: { type: String, required: true }
            },
            detail_2: {
                label: { type: String, required: true },
                icon: { type: String, required: true },
                text: { type: String, required: true }
            },
            detail_3: {
                label: { type: String, required: true },
                icon: { type: String, required: true },
                text: { type: String, required: true }
            },
            detail_4: {
                label: { type: String, required: true },
                icon: { type: String, required: true },
                text: { type: String, required: true }
            }
        },
        error_page: {
            error_page_content: { type: String, required: true },
            back_button_enable: { type: Boolean, required: true },
            back_button_text: { type: String, required: true }
        },
        seo: {
            meta_tags: { type: String, required: true },
            meta_title: { type: String, required: true },
            meta_description: { type: String, required: true },
            og_title: { type: String, required: true },
            og_description: { type: String, required: true },
            og_image_id: { type: Number, required: true },
            og_image: {
                id: { type: Number, required: true },
                collection_name: { type: String, required: true },
                name: { type: String, required: true },
                file_name: { type: String, required: true },
                mime_type: { type: String, required: true },
                disk: { type: String, required: true },
                conversions_disk: { type: String, required: true },
                size: { type: String, required: true },
                created_by_id: { type: String },
                created_at: { type: Date, required: true },
                updated_at: { type: Date, required: true },
                original_url: { type: String, required: true }
            }
        }
    }
})


const themeOptionModel = mongoose.model("themesOption", themeOptionschema)

export default themeOptionModel
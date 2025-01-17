import { Attachment } from "./attachment.interface";

export interface ThemeOption {
   id: number
   options: Option;
}

export interface Option {
   logo: Logo;
   general: General;
   seo: SEO;
   header: Header;
   footer: Footer;
   blog: Blog;
   product: ProductThemeOption;
   collection: Collection;
   seller: Seller;
   contact_us: Contact;
   error_page: ErrorPage;
}

export interface Logo {
   header_logo_id: number;
   footer_logo_id: number;
   favicon_icon_id: number;
   favicon_icon: Attachment;
   header_logo: Attachment;
   footer_logo: Attachment;
}

export interface General {
   site_title: string;
   site_tagline: string;
   cart_style: string;
   preloader_enable: number | boolean;
   back_to_top_enable: number | boolean;
   language_direction: string;
   hover_color: string;
   primary_color: string;
   secondary_color: string;
   link_color: string;
   mode: string;
}

export interface SEO {
   meta_tags: string;
   meta_title: string;
   meta_description: string;
   og_title: string;
   og_description: string;
   og_image_id: number;
   og_image: Attachment;
}

export interface Header {
   sticky_header_enable: number | boolean;
   header_options: string;
   page_top_bar_enable: number | boolean;
   top_bar_content: TopBarContent[];
   page_top_bar_dark: number | boolean;
   support_number: string;
   today_deals: [];
   category_ids: number[];
}

export interface TopBarContent {
   content: string;
}

export interface Link {
   link: string;
   label: string;
 }

export interface Footer {
   footer_style: string;
   footer_copyright: number | boolean;
   copyright_content: string;
   footer_about: string;
   about_address: string;
   about_email: string;
   footer_categories: number[];
   help_center: Link[];
   useful_link: Link[];
   support_number: number;
   support_email: string;
   play_store_url: string;
   app_store_url: string;
   social_media_enable: number | boolean;
   facebook: string;
   instagram: string;
   twitter: string;
   pinterest: string;
}

export interface Blog {
   blog_style: string;
   blog_sidebar_type: string;
   blog_author_enable: number | boolean;
   read_more_enable: number | boolean;
}

export interface Seller {
   about: About;
   services: Services;
   steps: Steps;
   start_selling: Step;
   store_layout: string;
   store_details: string;
}

export interface About {
   status: boolean;
   title: string;
   description: string;
   image_url: string;
}

export interface Services {
   status: boolean;
   title: string
   service_1: Service;
   service_2: Service;
   service_3: Service;
   service_4: Service;
}

export interface Service {
   status: boolean;
   title: string;
   description: string;
   image_url: string;
}

export interface Steps {
   status: boolean;
   title: string;
   step_1: Step;
   step_2: Step;
   step_3: Step;
}

export interface Step {
   status: boolean;
   title: string;
   description: string;
}

export interface Contact {
   contact_image_url: string;
   detail_1: Detail;
   detail_2: Detail;
   detail_3: Detail;
   detail_4: Detail;
}

export interface Detail {
   label: string;
   icon: string;
   text: string;
}

export interface ErrorPage {
   error_page_content: string;
   back_button_enable: number | boolean;
   back_button_text: string;
}

export interface ProductThemeOption {
   product_layout: string;
   is_trending_product: boolean;
   banner_enable: boolean;
   banner_image_url: string;
   safe_checkout: boolean,
   safe_checkout_image: string,
   secure_checkout: boolean,
   secure_checkout_image: string,
   encourage_order: boolean,
   encourage_max_order_count: number,
   encourage_view: boolean,
   encourage_max_view_count: number,
   sticky_checkout: boolean,
   sticky_product: boolean,
   social_share: boolean,
   shipping_and_return: string,
}

export interface Collection {
   collection_layout: string;
   collection_banner_image_url: string;
}

export interface Images {
   image_url: string,
}


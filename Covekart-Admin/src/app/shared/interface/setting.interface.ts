import { Attachment } from "./attachment.interface";
import { Currency } from "./currency.interface";

export interface Setting {
   id?: number;
   values: Values;
}

export interface Values {
   general: General;
   activation: Activation;
   wallet_points: WalletPoints;
   email: Email;
   vendor_commissions: VendorCommissions;
   refund: Refund;
   newsletter: Newsletter;
   analytics: Analytics;
   delivery: Delivery;
   google_reCaptcha: GoogleReCaptcha;
   payment_methods: PaymentMethods;
   maintenance: Maintenance;
}

export interface Language {
   language: string;
   code: string;
   icon: string;
 }
 
export interface DayInterval {
   title: string;
   description: string;
}

export interface General {
   light_logo_image?: Attachment;
   dark_logo_image?: Attachment;
   favicon_image?: Attachment;
   tiny_logo_image?: Attachment;
   light_logo_image_id?: number;
   dark_logo_image_id?: number;
   tiny_logo_image_id?: number;
   favicon_image_id?: number;
   site_title: string;
   site_tagline:string;
   default_timezone:string;
   default_currency_id: number;
   admin_site_language_direction: string;
   min_order_amount:number;
   min_order_free_shipping:number;
   product_sku_prefix: string;
   default_currency: Currency;
   mode: string;
   copyright: string;
}

export interface Activation {
   multivendor: number | boolean;
   point_enable: number | boolean;
   coupon_enable: number | boolean;
   wallet_enable: number | boolean;
   catalog_enable: number | boolean;
   stock_product_hide: number | boolean;
   store_auto_approve: number | boolean;
   product_auto_approve: number | boolean;
}

export interface WalletPoints {
   signup_points: number;
   min_per_order_amount: number;
   point_currency_ratio: number;
   reward_per_order_amount: number;
}

export interface Email {
   mail_host: string;
   mail_port: number;
   mail_mailer: string;
   mail_password: string;
   mail_username: string;
   mail_encryption: string;
   mail_from_name: string;
   mail_from_address: string;
   mailgun_domain: string;
   mailgun_secret: string;
}

export interface VendorCommissions {
   status: number,
   min_withdraw_amount: number,
   default_commission_rate: number,
   is_category_based_commission: number
}

export interface Refund {
   status: boolean;
   refundable_days: number;
}

export interface Newsletter {
   status: string;
   mailchip_api_key: string;
   mailchip_list_id: string;
}

export interface Analytics {
   facebook_pixel: {
      status : number | boolean;
      pixel_id: string;
   }
   google_analytics: {
      status: number | boolean;
      measurement_id: string;
   }
}

export interface Delivery {
   default_delivery: number | boolean;
   default: DeliveryDay;
   same_day_delivery: boolean;
   same_day: DeliveryDay;
   same_day_intervals: DayInterval[];
}

export interface DeliveryDay {
   title: Setting;
   description: string;
}

export interface DeliveryBlock {
   delivery_description: string | null;
   delivery_interval: string | null;
}

export interface GoogleReCaptcha {
   secret: string
   status: number | boolean;
   site_key: string
}

export interface PaymentMethods {
   paypal: Paypal;
   stripe:StripeAndRazorpay;
   razorpay: StripeAndRazorpay;
   mollie: Mollie;
   cod: COD;
   cash_on_delivery: CashOnDelivery;
}

export interface CashOnDelivery {
   status: number | boolean;
}

export interface Paypal {
   status: number | boolean;
   client_id: string
   client_secret: string
   sandbox_mode: string
}

export interface StripeAndRazorpay {
   key: string;
   secret: string;
   status: number| boolean;
}

export interface Mollie {
   status: number| boolean;
   secret_key: string;
}

export interface COD {
   status: number| boolean;
}

export interface Maintenance {
   title: string;
   maintenance_mode: boolean;
   maintenance_image_id: number;
   maintenance_image: Attachment;
   description: string;
}
import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "dashboard",
    loadChildren: () => import("../../components/dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "account",
    loadChildren: () => import("../../components/account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "role",
    loadChildren: () => import("../../components/role/role.module").then((m) => m.RoleModule),
  },
  {
    path: "user",
    loadChildren: () => import("../../components/user/user.module").then((m) => m.UserModule),
  },
  {
    path: "attribute",
    loadChildren: () => import("../../components/attribute/attribute.module").then((m) => m.AttributeModule),
  },
  {
    path: "tag",
    loadChildren: () => import("../../components/tag/tag.module").then((m) => m.TagModule),
  },
  {
    path: "blog",
    loadChildren: () => import("../../components/blog/blog.module").then((m) => m.BlogModule),
  },
  {
    path: "page",
    loadChildren: () => import("../../components/page/page.module").then((m) => m.PageModule),
  },
  {
    path: "tax",
    loadChildren: () => import("../../components/tax/tax.module").then((m) => m.TaxModule),
  },
  {
    path: "store",
    loadChildren: () => import("../../components/store/store.module").then((m) => m.StoreModule),
  },
  {
    path: "category",
    loadChildren: () => import("../../components/category/category.module").then((m) => m.CategoryModule),
  },
  {
    path: "shipping",
    loadChildren: () => import("../../components/shipping/shipping.module").then((m) => m.ShippingModule),
  },
  {
    path: "media",
    loadChildren: () => import("../../components/media/media.module").then((m) => m.MediaModule),
  },
  {
    path: "coupon",
    loadChildren: () => import("../../components/coupon/coupon.module").then((m) => m.CouponModule),
  },
  {
    path: "product",
    loadChildren: () => import("../../components/product/product.module").then((m) => m.ProductModule),
  },
  {
    path: "currency",
    loadChildren: () => import("../../components/currency/currency.module").then((m) => m.CurrencyModule),
  },
  {
    path: "wallet",
    loadChildren: () => import("../../components/wallet/wallet.module").then((m) => m.WalletModule),
  },
  {
    path: "point",
    loadChildren: () => import("../../components/point/point.module").then((m) => m.PointModule),
  },
  {
    path: "setting",
    loadChildren: () => import("../../components/setting/setting.module").then((m) => m.SettingModule),
  },
  {
    path: "order-status",
    loadChildren: () => import("../../components/order-status/order-status.module").then((m) => m.OrderStatusModule),
  },
  {
    path: "order",
    loadChildren: () => import("../../components/order/order.module").then((m) => m.OrderModule),
  },
  {
    path: "theme-option",
    loadChildren: () => import("../../components/theme-option/theme-option.module").then((m) => m.ThemeOptionModule),
  },
  {
    path: "theme",
    loadChildren: () => import("../../components/theme/theme.module").then((m) => m.ThemeModule),
  },
  {
    path: "commission",
    loadChildren: () => import("../../components/commission/commission.module").then((m) => m.CommissionModule),
  },
  {
    path: "vendor-wallet",
    loadChildren: () => import("../../components/vendor-wallet/vendor-wallet.module").then((m) => m.VendorWalletModule),
  },
  {
    path: "payment-details",
    loadChildren: () => import("../../components/payout-details/payout-details.module").then((m) => m.PaymentDetailsModule),
  },
  {
    path: "review",
    loadChildren: () => import("../../components/review/review.module").then((m) => m.ReviewModule)
  },
  {
    path: "faq",
    loadChildren: () => import("../../components/faq/faq.module").then((m) => m.FaqModule)
  },
  {
    path: "notification",
    loadChildren: () => import("../../components/notification/notification.module").then((m) => m.NotificationModule)
  },
  {
    path: "refund",
    loadChildren: () => import("../../components/refund/refund.module").then((m) => m.RefundModule)
  },
  {
    path: "withdrawal",
    loadChildren: () => import("../../components/withdrawal/withdrawal.module").then((m) => m.WithdrawalModule)
  },
  {
    path: "qna",
    loadChildren: () => import("../../components/questions-answers/questions-answers.module").then((m) => m.QuestionsAnswersModule)
  }
];

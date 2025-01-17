import { Routes } from "@angular/router";
import { Error404Component } from './../../components/page/error404/error404.component';

export const content: Routes = [
    {
        path: "",
        loadChildren: () => import("../../components/themes/themes.module").then((m) => m.ThemesModule)
    },
    {
        path: "auth",
        loadChildren: () => import("../../components/auth/auth.module").then((m) => m.AuthModule)
    },
    {
        path: "account",
        loadChildren: () => import("../../components/account/account.module").then((m) => m.AccountModule)
    },
    {
        path: "",
        loadChildren: () => import("../../components/shop/shop.module").then((m) => m.ShopModule)
    },
    {
        path: "",
        loadChildren: () => import("../../components/blog/blog.module").then((m) => m.BlogModule)
    },
    {
        path: "",
        loadChildren: () => import("../../components/page/page.module").then((m) => m.PagesModule)
    },
    {
        path: '**',
        pathMatch: 'full',
        component: Error404Component
    }
]

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemesRoutingModule } from './themes-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { BlogModule } from '../blog/blog.module';
import { ShopModule } from '../shop/shop.module';

import { ThemesComponent } from './themes.component';

// Themes
import { TokyoComponent } from './tokyo/tokyo.component';
import { ParisComponent } from './paris/paris.component';
import { BerlinComponent } from './berlin/berlin.component';
import { DenverComponent } from './denver/denver.component';
import { OsakaComponent } from './osaka/osaka.component';
import { RomeComponent } from './rome/rome.component';
import { MadridComponent } from './madrid/madrid.component';

// Widgets
import { BannerComponent } from './widgets/banner/banner.component';
import { CategoriesComponent } from './widgets/categories/categories.component';
import { ProductComponent } from './widgets/product/product.component';
import { NewsletterComponent } from './widgets/newsletter/newsletter.component';
import { HomeBannerComponent } from './widgets/home-banner/home-banner.component';
import { BlogComponent } from './widgets/blog/blog.component';
import { CollectionComponent } from './widgets/collection/collection .component';
import { FourColumnProductComponent } from './widgets/four-column-product/four-column-product.component';
import { WalletOfferComponent } from './widgets/wallet-offer/wallet-offer.component';
import { DealComponent } from './widgets/deal/deal.component';
import { ServiceComponent } from './widgets/service/service.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ThemesComponent,
    ParisComponent,
    HomeBannerComponent,
    BannerComponent,
    CategoriesComponent,
    ProductComponent,
    NewsletterComponent,
    BlogComponent,
    TokyoComponent,
    OsakaComponent,
    CollectionComponent,
    FourColumnProductComponent,
    RomeComponent,
    MadridComponent,
    WalletOfferComponent,
    DealComponent,
    BerlinComponent,
    DenverComponent,
    ServiceComponent
  ],
  imports: [
    CommonModule,
    ThemesRoutingModule,
    SharedModule,
    BlogModule,
    ShopModule,
    TranslateModule
  ],
  exports: [
    BlogComponent
  ]
})
export class ThemesModule { }

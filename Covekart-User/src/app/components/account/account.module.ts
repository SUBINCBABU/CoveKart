import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { AccountComponent } from './account.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WalletComponent } from './wallet/wallet.component';
import { PointComponent } from './point/point.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/details/details.component';
import { RefundComponent } from './refund/refund.component';
import { AdressesComponent } from './adresses/adresses.component';
import { NotificationComponent } from './notification/notification.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AccountComponent,
    DashboardComponent,
    SidebarComponent,
    WalletComponent,
    PointComponent,
    OrdersComponent,
    OrderDetailsComponent,
    RefundComponent,
    AdressesComponent,
    NotificationComponent,
    BankDetailsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class AccountModule { }

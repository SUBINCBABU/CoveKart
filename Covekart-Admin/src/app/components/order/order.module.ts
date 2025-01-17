import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { OrderComponent } from './order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddCustomerModalComponent } from './checkout/modal/add-customer-modal/add-customer-modal.component';
import { DetailsComponent } from './details/details.component';
import { AddAddressModalComponent } from './checkout/modal/add-address-modal/add-address-modal.component';
import { AddressBlockComponent } from './checkout/address-block/address-block.component';
import { DeliveryBlockComponent } from './checkout/delivery-block/delivery-block.component';
import { PaymentBlockComponent } from './checkout/payment-block/payment-block.component';
import { CouponModalComponent } from './checkout/modal/coupon-modal/coupon-modal.component';

// State
import { SettingState } from '../../shared/state/setting.state';
import { CategoryState } from '../../shared/state/category.state';
import { ProductState } from '../../shared/state/product.state';
import { CartState } from '../../shared/state/cart.state';
import { OrderState } from '../../shared/state/order.state';
import { OrderStatusState } from '../../shared/state/order-status.state';
import { UserState } from '../../shared/state/user.state';
import { StateState } from '../../shared/state/state.state';

@NgModule({
  declarations: [
    OrderComponent,
    CreateOrderComponent,
    CheckoutComponent,
    AddCustomerModalComponent,
    DetailsComponent,
    AddAddressModalComponent,
    AddressBlockComponent,
    DeliveryBlockComponent,
    PaymentBlockComponent,
    CouponModalComponent,
  ],

  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      SettingState,
      CategoryState,
      ProductState,
      CartState,
      OrderState,
      OrderStatusState,
      UserState,
      StateState,
    ])
  ]
})

export class OrderModule { }

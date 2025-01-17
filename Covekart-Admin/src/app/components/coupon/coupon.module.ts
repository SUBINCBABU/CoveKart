import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { CouponRoutingModule } from './coupon-routing.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from "../../shared/shared.module";

// Components
import { CouponComponent } from './coupon.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';
import { FormCouponComponent } from './form-coupon/form-coupon.component';

// State
import { CouponState } from '../../shared/state/coupon.state';
import { ProductState } from '../../shared/state/product.state';

@NgModule({
  declarations: [
    CouponComponent,
    CreateCouponComponent,
    EditCouponComponent,
    FormCouponComponent
  ],
  imports: [
    CommonModule,
    CouponRoutingModule,
    NgbDatepickerModule,
    SharedModule,
    NgxsModule.forFeature([CouponState, ProductState])
  ]
})
export class CouponModule { }

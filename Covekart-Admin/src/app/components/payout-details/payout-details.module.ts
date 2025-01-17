import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentDetailsRoutingModule } from './payout-details-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';

// Components
import { PayoutDetailsComponent } from './payout-details.component';

// State
import { UserState } from '../../shared/state/user.state';
import { PaymentDetailsState } from '../../shared/state/payment-details.state';

@NgModule({
  declarations: [
    PayoutDetailsComponent
  ],
  imports: [
    CommonModule,
    PaymentDetailsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      UserState,
      PaymentDetailsState
    ])
  ]
})
export class PaymentDetailsModule { }

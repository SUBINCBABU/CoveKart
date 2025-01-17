import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { WithdrawRequestRoutingModule } from './withdrawal-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { WithdrawalComponent } from './withdrawal.component';
import { WithdrawRequestModalComponent } from './modal/withdraw-request-modal/withdraw-request-modal.component';

// State
import { WithdrawalState } from '../../shared/state/withdrawal.state';
import { VendorWalletState } from '../../shared/state/vendor-wallet.state';

@NgModule({
  declarations: [
    WithdrawalComponent,
    WithdrawRequestModalComponent
  ],
  imports: [
    CommonModule,
    WithdrawRequestRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      WithdrawalState,
      VendorWalletState
    ])
  ]
})
export class WithdrawalModule { }

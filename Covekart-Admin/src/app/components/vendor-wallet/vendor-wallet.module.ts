import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { VendorWalletRoutingModule } from './vendor-wallet-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { VendorWalletComponent } from './vendor-wallet.component';

// State
import { UserState } from '../../shared/state/user.state';
import { VendorWalletState } from '../../shared/state/vendor-wallet.state';

@NgModule({
  declarations: [
    VendorWalletComponent
  ],
  imports: [
    CommonModule,
    VendorWalletRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      UserState, 
      VendorWalletState
    ])
  ]
})
export class VendorWalletModule { }

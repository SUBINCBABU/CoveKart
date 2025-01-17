import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { WalletRoutingModule } from './wallet-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { WalletComponent } from './wallet.component';

// State
import { UserState } from './../../shared/state/user.state';
import { WalletState } from './../../shared/state/wallet.state';
import { SettingState } from '../../shared/state/setting.state';

@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      UserState, 
      WalletState, 
      SettingState
    ])
  ]
})
export class WalletModule { }

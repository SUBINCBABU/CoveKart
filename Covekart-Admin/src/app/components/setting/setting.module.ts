import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { SettingComponent } from './setting.component';

// State
import { SettingState } from '../../shared/state/setting.state';
import { CurrencyState } from '../../shared/state/currency.state';

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      SettingState,
      CurrencyState
    ])
  ]
})
export class SettingModule { }

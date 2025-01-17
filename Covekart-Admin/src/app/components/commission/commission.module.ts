import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { CommissionRoutingModule } from './commission-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { CommissionComponent } from './commission.component';

// States
import { CommissionState } from '../../shared/state/commission.state';

@NgModule({
  declarations: [
    CommissionComponent
  ],
  imports: [
    CommonModule,
    CommissionRoutingModule,
    SharedModule,
    NgxsModule.forFeature([CommissionState])
  ]
})
export class CommissionModule { }

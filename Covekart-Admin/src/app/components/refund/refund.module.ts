import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { RefundRoutingModule } from './refund-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { RefundComponent } from './refund.component';

// State
import { RefundState } from '../../shared/state/refund.state';

@NgModule({
  declarations: [
    RefundComponent
  ],
  imports: [
    CommonModule,
    RefundRoutingModule,
    SharedModule,
    NgxsModule.forFeature([RefundState])
  ]
})
export class RefundModule { }

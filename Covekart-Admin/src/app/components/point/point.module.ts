import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { PointRoutingModule } from './point-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { PointComponent } from './point.component';

// State
import { UserState } from './../../shared/state/user.state';
import { PointState } from './../../shared/state/point.state';

@NgModule({
  declarations: [
    PointComponent
  ],
  imports: [
    CommonModule,
    PointRoutingModule,
    SharedModule,
    NgxsModule.forFeature([UserState, PointState])
  ]
})
export class PointModule { }

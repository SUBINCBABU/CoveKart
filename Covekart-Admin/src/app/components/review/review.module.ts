import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ReviewRoutingModule } from './review-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { ReviewComponent } from './review.component';

// State
import { ReviewState } from '../../shared/state/review.state';

@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    NgxsModule.forFeature([ReviewState]),
    SharedModule
  ]
})
export class ReviewModule { }

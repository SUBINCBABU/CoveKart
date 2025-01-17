import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { QuestionsAnswersRoutingModule } from './questions-answers-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { QuestionsAnswersComponent } from './questions-answers.component';
import { QuestionAnswersState } from '../../shared/state/questions-answers.state';
import { AnswersModalComponent } from './answers-modal/answers-modal.component';
import { ProductState } from '../../shared/state/product.state';

@NgModule({
  declarations: [
    QuestionsAnswersComponent,
    AnswersModalComponent,
  ],
  imports: [
    CommonModule,
    QuestionsAnswersRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      QuestionAnswersState,
      ProductState
    ])
  ]
})
export class QuestionsAnswersModule { }

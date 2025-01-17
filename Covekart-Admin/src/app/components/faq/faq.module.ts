import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqRoutingModule } from './faq-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';

// Components
import { FaqComponent } from './faq.component';
import { CreateFaqComponent } from './create-faq/create-faq.component';
import { EditFaqComponent } from './edit-faq/edit-faq.component';
import { FormFaqComponent } from './form-faq/form-faq.component';

// State
import { FaqState } from '../../shared/state/faq.state';

@NgModule({
  declarations: [
    FaqComponent,
    CreateFaqComponent,
    EditFaqComponent,
    FormFaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    SharedModule,
    NgxsModule.forFeature([FaqState])
  ]
})
export class FaqModule { }

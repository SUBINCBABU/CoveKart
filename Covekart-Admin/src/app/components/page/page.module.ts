import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxEditorModule } from 'ngx-editor';

import { PageRoutingModule } from './page-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { PageComponent } from './page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FormPageComponent } from './form-page/form-page.component';

// State
import { PageState } from '../../shared/state/page.state';

@NgModule({
  declarations: [
    PageComponent,
    CreatePageComponent,
    EditPageComponent,
    FormPageComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    SharedModule,
    NgxsModule.forFeature([PageState]),
    NgxEditorModule
  ]
})
export class PageModule { }

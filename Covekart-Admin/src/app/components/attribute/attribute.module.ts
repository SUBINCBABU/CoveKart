import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeRoutingModule } from './attribute-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { NgxsModule } from '@ngxs/store';

// Components
import { AttributeComponent } from './attribute.component';
import { CreateAttributeComponent } from './create-attribute/create-attribute.component';
import { EditAttributeComponent } from './edit-attribute/edit-attribute.component';
import { FormAttributeComponent } from './form-attribute/form-attribute.component';

// States
import { AttributeState } from '../../shared/state/attribute.state';

@NgModule({
  declarations: [
    AttributeComponent,
    CreateAttributeComponent,
    EditAttributeComponent,
    FormAttributeComponent
  ],
  imports: [
    CommonModule,
    AttributeRoutingModule,
    SharedModule,
    NgxsModule.forFeature([AttributeState])
  ]
})
export class AttributeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";
import { TaxRoutingModule } from './tax-routing.module';

// Components
import { TaxComponent } from './tax.component';
import { EditTaxComponent } from './edit-tax/edit-tax.component';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { FormTaxComponent } from './form-tax/form-tax.component';

// State
import { TaxState } from '../../shared/state/tax.state';

@NgModule({
  declarations: [
    TaxComponent,
    EditTaxComponent,
    CreateTaxComponent,
    FormTaxComponent
  ],
  imports: [
    CommonModule,
    TaxRoutingModule,
    SharedModule,
    NgxsModule.forFeature([TaxState])
  ]
})
export class TaxModule { }

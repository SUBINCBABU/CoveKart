import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { CurrencyRoutingModule } from './currency-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { CurrencyComponent } from './currency.component';
import { CreateCurrencyComponent } from './create-currency/create-currency.component';
import { EditCurrencyComponent } from './edit-currency/edit-currency.component';
import { FormCurrencyComponent } from './form-currency/form-currency.component';

// State
import { CurrencyState } from '../../shared/state/currency.state';

@NgModule({
  declarations: [
    CurrencyComponent,
    CreateCurrencyComponent,
    EditCurrencyComponent,
    FormCurrencyComponent
  ],
  imports: [
    CommonModule,
    CurrencyRoutingModule,
    SharedModule,
    NgxsModule.forFeature([CurrencyState])
  ]
})
export class CurrencyModule { }

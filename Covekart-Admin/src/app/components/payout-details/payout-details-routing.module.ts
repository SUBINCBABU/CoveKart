import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayoutDetailsComponent } from './payout-details.component';

const routes: Routes = [
  {
    path: '',
    component: PayoutDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentDetailsRoutingModule { }

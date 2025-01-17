import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { ShippingRuleModalComponent } from "../modal/shipping-rule-modal/shipping-rule-modal.component";
import { ShippingState } from '../../../shared/state/shipping.state';
import { Shipping } from '../../../shared/interface/shipping.interface';
import { EditShipping, DeleteShippingRule } from '../../../shared/action/shipping.action';

@Component({
  selector: 'app-shipping-country',
  templateUrl: './shipping-country.component.html',
  styleUrls: ['./shipping-country.component.scss']
})
export class ShippingCountryComponent {

  @Select(ShippingState.selectedShipping) shipping$: Observable<Shipping>;

  @ViewChild("createShippingRuleModal") CreateShippingRuleModal: ShippingRuleModalComponent;

  public id: number;
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
  
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditShipping(params['id']))
                      .pipe(mergeMap(() => this.store.select(ShippingState.selectedShipping)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(shipping => {
        this.id = shipping?.id!;
      });
  }

  delete(actionType: string, data: Shipping) {
    this.store.dispatch(new DeleteShippingRule(data?.id))
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

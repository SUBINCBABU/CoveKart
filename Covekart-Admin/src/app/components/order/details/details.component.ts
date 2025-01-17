import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { ViewOrder } from '../../../shared/action/order.action';
import { UpdateOrderStatus } from '../../../shared/action/order.action';
import { GetOrderStatus } from '../../../shared/action/order-status.action';
import { OrderState } from '../../../shared/state/order.state';
import { OrderStatusState } from '../../../shared/state/order-status.state';
import { Order } from '../../../shared/interface/order.interface';
import { OrderStatus, OrderStatusModel } from '../../../shared/interface/order-status.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  @Select(OrderStatusState.orderStatus) orderStatus$: Observable<OrderStatusModel>;
  @Select(OrderStatusState.orderStatuses) orderStatuses$: Observable<Select2Data>;

  public order: Order;
  public statuses: OrderStatus[] = [];

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute) {
    this.store.dispatch(new GetOrderStatus());
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new ViewOrder(params['id']))
                      .pipe(mergeMap(() => this.store.select(OrderState.selectedOrder)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(order => {
        this.order = order!
      });
  }

  updateOrderStatus(data: Select2UpdateEvent) {
    if(data && data?.value) {
      this.store.dispatch(new UpdateOrderStatus(this.order?.id!, { order_status_id: Number(data?.value) }));
    }
  }

  ngOnDestroy() {
    this.statuses = [];
    this.destroy$.next();
    this.destroy$.complete();

  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetOrders } from '../../shared/action/order.action';
import { OrderState } from '../../shared/state/order.state';
import { Params } from '../../shared/interface/core.interface';
import { Order, OrderModel } from '../../shared/interface/order.interface';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  @Select(OrderState.order) order$: Observable<OrderModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "order_number", dataField: "order_id" },
      { title: "order_date", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "customer_name", dataField: "consumer_name" },
      { title: "total_amount", dataField: "total", type: 'price' },
      { title: "payment_status", dataField: "order_payment_status" },
      { title: "payment_method", dataField: "payment_mode" }
    ],
    rowActions: [
      { label: "View", actionToPerform: "view", icon: "ri-eye-line", permission: "order.edit" }
    ],
    data: [],
    total: 0
  };

  constructor(private store: Store,
    private router: Router) { }

  ngOnInit() {
    this.order$.subscribe(order => { 
      this.tableConfig.data = order ? order?.data : [];
      this.tableConfig.total = order ? order?.total : 0;
    });

    this.order$.subscribe(order => {
      let orders = order?.data?.filter((element: Order) => {
        element.order_id = `<span class="fw-bolder">#${element.order_number}</span>`;
        element.order_payment_status = element.payment_status ? `<div class="status-${element.payment_status.toLowerCase()}"><span>${element.payment_status.replace(/_/g, " ")}</span></div>` : '-';
        element.payment_mode = element.payment_method ? `<div class="payment-mode"><span>${element.payment_method.replace(/_/g, " ").toUpperCase()}</span></div>` : '-';
        element.consumer_name = `<span class="text-capitalize">${element.consumer.name}</span>`;
        return element;
      });
      this.tableConfig.data = order ? orders : [];
      this.tableConfig.total = order ? order?.total : 0;
    });
  }

  onTableChange(data?: Params) { 
    this.store.dispatch(new GetOrders(data!));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'view')
      this.view(action.data)
  }

  view(data: Order) {
    this.router.navigateByUrl(`/order/details/${data.order_number}`);
  }

}

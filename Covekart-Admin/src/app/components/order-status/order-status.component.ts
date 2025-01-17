import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetOrderStatus } from '../../shared/action/order-status.action';
import { TableConfig } from '../../shared/interface/table.interface';
import { Params } from '../../shared/interface/core.interface';
import { OrderStatus, OrderStatusModel } from '../../shared/interface/order-status.interface';
import { OrderStatusState } from '../../shared/state/order-status.state';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent {

  @Select(OrderStatusState.orderStatus) orderStatus$: Observable<OrderStatusModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "name", dataField: "name" },
      { title: "sequence", dataField: "sequence", sortable: true, sort_direction: 'asc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line" },
    ],
    data: [] as OrderStatus[],
    total: 0
  };

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.orderStatus$.subscribe(orderStatus => { 
      this.tableConfig.data  = orderStatus ? orderStatus?.data  : [];
      this.tableConfig.total = orderStatus ? orderStatus?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetOrderStatus(data));
  }

}

import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Coupon, CouponModel } from "../../shared/interface/coupon.interface";
import { CouponState } from '../../shared/state/coupon.state';
import { GetCoupons, UpdateCouponStatus, 
         DeleteCoupon, DeleteAllCoupon } from '../../shared/action/coupon.action';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent {

  @Select(CouponState.coupon) coupon$: Observable<CouponModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "code", dataField: "code", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "coupon.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "coupon.destroy" },
    ],
    data: [] as Coupon[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.coupon$.subscribe(coupon => { 
      this.tableConfig.data = coupon ? coupon?.data : [];
      this.tableConfig.total = coupon ? coupon?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetCoupons(data)).subscribe();
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'status')
      this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Coupon) {
    this.router.navigateByUrl(`/coupon/edit/${data.id}`);
  }

  status(data: Coupon) {
    this.store.dispatch(new UpdateCouponStatus(data.id, data.status))
  }

  delete(data: Coupon) {
    this.store.dispatch(new DeleteCoupon(data.id))
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllCoupon(ids))
  }
 
}

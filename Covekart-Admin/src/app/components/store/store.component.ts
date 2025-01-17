import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { Params } from '../../shared/interface/core.interface';
import { Stores, StoresModel } from '../../shared/interface/store.interface';
import { StoreState } from '../../shared/state/store.state';
import { GetStores, DeleteStore, DeleteAllStore, ApproveStoreStatus, UpdateStoreStatus } from '../../shared/action/store.action';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent {

  @Select(StoreState.store) store$: Observable<StoresModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "Logo", dataField: "store_logo", class: 'tbl-logo-image', type: 'image', key: 'store_name' },
      { title: "store_name", dataField: "store_name" },
      { title: "name", dataField: "vendor_name" },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "approved", dataField: "is_approved", type: "switch" },

    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "store.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "store.destroy" },
    ],
    data: [] as Stores[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.store$.subscribe(store => {
      let stores = store?.data?.filter((element: Stores) => {
        element.vendor_name = element.vendor.name;
        return element;
      });
      this.tableConfig.data = stores ? stores : [];
      this.tableConfig.total = store ? store?.total : 0;
    });


  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetStores(data));
  }

  onActionClicked(action: TableClickedAction) {
    
    if (action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'status')
      this.status(action.data)
    else if (action.actionToPerform == 'is_approved')
      this.approve(action.data)
    else if (action.actionToPerform == 'delete')
      this.delete(action.data)
    else if (action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Stores) {
    this.router.navigateByUrl(`/store/edit/${data.id}`);
  }

status(data: Stores){
  this.store.dispatch(new UpdateStoreStatus(data.id,data.status))
}
  approve(data: Stores) {
    this.store.dispatch(new ApproveStoreStatus(data.id, data.is_approved))
  }

  delete(data: Stores) {
    this.store.dispatch(new DeleteStore(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllStore(ids));
  }

}

import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Tax, TaxModel } from "../../shared/interface/tax.interface";
import { TaxState } from '../../shared/state/tax.state';
import { GetTaxes, UpdateTaxStatus, 
         DeleteTax, DeleteAllTax } from '../../shared/action/tax.action';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent {

  @Select(TaxState.tax) tax$: Observable<TaxModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "tax.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "tax.destroy" },
    ],
    data: [] as Tax[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.tax$.subscribe(tax => { 
      this.tableConfig.data = tax ? tax?.data : [];
      this.tableConfig.total = tax ? tax?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetTaxes(data));
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

  edit(data: Tax) {
    this.router.navigateByUrl(`/tax/edit/${data.id}`);
  }

  status(data: Tax) {
    this.store.dispatch(new UpdateTaxStatus(data.id, data.status));
  }

  delete(data: Tax) {
    this.store.dispatch(new DeleteTax(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllTax(ids));
  }

}

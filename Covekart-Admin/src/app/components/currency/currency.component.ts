import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Currency, CurrencyModel } from "../../shared/interface/currency.interface";
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { CurrencyState } from '../../shared/state/currency.state';
import { GetCurrencies, UpdateCurrencyStatus, 
         DeleteCurrency, DeleteAllCurrency } from '../../shared/action/currency.action';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent {

  @Select(CurrencyState.currency) currency$: Observable<CurrencyModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "code", dataField: "code", sortable: true, sort_direction: 'desc' },
      { title: "symbol", dataField: "symbol" },
      { title: "exchange_rate", dataField: "exchange_rate" },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "currency.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "currency.destroy" },
    ],
    data: [] as Currency[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit(): void {
    this.currency$.subscribe(currency => { 
      this.tableConfig.data = currency ? currency?.data : [];
      this.tableConfig.total = currency ? currency?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetCurrencies(data));
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

  edit(data: Currency) {
    this.router.navigateByUrl(`/currency/edit/${data.id}`);
  }

  status(data: Currency) {
    this.store.dispatch(new UpdateCurrencyStatus(data.id, data.status));
  }

  delete(data: Currency) {
    this.store.dispatch(new DeleteCurrency(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllCurrency(ids));
  }

}

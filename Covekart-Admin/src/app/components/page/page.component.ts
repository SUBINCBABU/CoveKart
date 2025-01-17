import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Page, PageModel } from "../../shared/interface/page.interface";
import { PageState } from '../../shared/state/page.state';
import { GetPages, UpdatePageStatus, 
         DeletePage, DeleteAllPage } from '../../shared/action/page.action';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  
  @Select(PageState.page) page$: Observable<PageModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "title", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc'  },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "page.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "page.destroy" },
    ],
    data: [] as Page[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit(): void {
    this.page$.subscribe(page => { 
      this.tableConfig.data  = page ? page?.data  : [];
      this.tableConfig.total = page ? page?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetPages(data));
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

  edit(data: Page) {
    this.router.navigateByUrl(`/page/edit/${data.id}`);
  }

  status(data: Page) {
    this.store.dispatch(new UpdatePageStatus(data.id, data.status));
  }

  delete(data: Page) {
    this.store.dispatch(new DeletePage(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllPage(ids));
  }

}

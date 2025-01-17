import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Role, RoleModel } from "../../shared/interface/role.interface";
import { RoleState } from '../../shared/state/role.state';
import { GetRoles, DeleteRole, DeleteAllRole } from '../../shared/action/role.action';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {

  @Select(RoleState.role) role$: Observable<RoleModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' }
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "role.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "role.destroy" },
    ],
    data: [] as Role[],
    total: 0
  };
  
  constructor(private store: Store,
    private router: Router) { }

  ngOnInit() {
    
    this.role$.subscribe(role => { 
      this.tableConfig.data = role ? role?.data : [];
      this.tableConfig.total = role ? role?.total : 0;
    });
  }

  onTableChange(data?: Params) { 

    this.store.dispatch(new GetRoles(data!));
  }

  onActionClicked(action: TableClickedAction) {

    if(action.actionToPerform == 'edit')
      
      this.edit(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Role) {
    
    this.router.navigateByUrl(`/role/edit/${data.id}`);
  }

  delete(data: Role) {
    this.store.dispatch(new DeleteRole(data.id))
    
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllRole(ids))
  }

}

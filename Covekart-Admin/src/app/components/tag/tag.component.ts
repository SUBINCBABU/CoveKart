import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Tag, TagModel } from "../../shared/interface/tag.interface";
import { TagState } from '../../shared/state/tag.state';
import { GetTags, UpdateTagStatus, 
         DeleteTag, DeleteAllTag } from '../../shared/action/tag.action';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {

  @Select(TagState.tag) tag$: Observable<TagModel>;

  @Input() tagType: string | null = 'product';

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "tag.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "tag.destroy" },
    ],
    data: [] as Tag[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
   
    this.tag$.subscribe(tag => { 
      this.tableConfig.data  = tag ? tag?.data  : [];
      this.tableConfig.total = tag ? tag?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    data!['type'] = this.tagType!;
    this.store.dispatch(new GetTags(data));
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

  edit(data: Tag) {
    if(this.tagType == 'post')
      this.router.navigateByUrl(`/blog/tag/edit/${data.id}`);
    else
      this.router.navigateByUrl(`/tag/edit/${data.id}`);
  }

  status(data: Tag) {
    this.store.dispatch(new UpdateTagStatus(data.id, data.status))
  }

  delete(data: Tag) {
    this.store.dispatch(new DeleteTag(data.id))
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllTag(ids))
  }

}

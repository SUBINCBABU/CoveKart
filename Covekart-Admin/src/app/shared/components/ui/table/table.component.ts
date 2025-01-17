import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { LoaderState } from '../../../state/loader.state';
import { DeleteModalComponent } from "../modal/delete-modal/delete-modal.component";
import { ConfirmationModalComponent } from "../modal/confirmation-modal/confirmation-modal.component";
import { TableClickedAction, TableColumn, TableConfig } from '../../../interface/table.interface';
import { Params } from '../../../interface/core.interface';
import { AccountState } from '../../../../shared/state/account.state';
import { Permission } from '../../../..//shared/interface/role.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Select(LoaderState.status) loadingStatus$: Observable<boolean>;
  @Select(AccountState.permissions) permissions$: Observable<Permission[]>;

  @Input() tableConfig: TableConfig;
  @Input() hasCheckbox: boolean = false;
  @Input() hasDuplicate: boolean = false;
  @Input() topbar: boolean = true;
  @Input() pagination: boolean = true;
  @Input() loading: boolean = true;
  @Input() dateRange: boolean = false;
  
  @Output() tableChanged: EventEmitter<Params> = new EventEmitter();
  @Output() action = new EventEmitter<TableClickedAction>();
  @Output() rowClicked = new EventEmitter<any>();
  @Output() selectedItems = new EventEmitter<number[]>();

  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;
  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;

  public term = new FormControl();
  public rows = [30, 50, 100];
  public tableData: Params = {
    'search': '',
    'field': '', 
    'sort': '', // current Sorting Order
    'page': 1, // current page number
    'paginate': 30, // Display per page,
  };

  public selected: number[] = [];
  public permissions: string[] = [];

  public hoveredDate: NgbDate | null = null;
	public fromDate: NgbDate | null;
	public toDate: NgbDate | null;

  constructor(@Inject(DOCUMENT) private document: Document,
  private renderer: Renderer2, config: NgbRatingConfig, 
  private calendar: NgbCalendar, 
  public formatter: NgbDateParserFormatter) { 
		config.max = 5;     // customize default values of ratings used by this component tree
		config.readonly = true;
    
    this.term.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(
        (data: string) => {
          this.onChangeTable(data, 'search');
      });
  }

  ngOnInit() {
    this.tableChanged.emit(this.tableData);
    this.permissions$.subscribe(permission => {
      this.permissions = permission?.map((value: Permission) => value?.name);
      const permissions = this.tableConfig?.rowActions?.map(action => action?.permission).filter(item => item != undefined);
      if(permissions?.length && !permissions.some(action => this.permissions?.includes(<any>action))){
        this.tableConfig['rowActions'] = [];
      }
      if(!this.hasPermission(['delete']) && !this.hasDuplicate) {
        this.hasCheckbox = false;
      }
    });
    this.loadingStatus$.subscribe(res => {
      if(res == false) {
        this.selected = [];
      }
    })
  }

  hasPermission(actions?: string[]) {
    let permission = this.tableConfig?.rowActions?.find(action => actions?.includes(action.actionToPerform))?.permission;
    if (!Array.isArray(permission) && this.permissions?.includes(permission!)) {
      return true;
    } else {
      return false;
    }
  }
  
  onChangeTable(data: TableColumn | any, type: string) {
    if (type === 'sort' && data && data.sortable !== false) {
      switch (data.sort_direction) {
        case 'asc':
          data.sort_direction = 'desc';
          break;
        case 'desc':
          data.sort_direction = 'asc';
          break;
        default:
          data.sort_direction = 'desc';
          break;
      }
      this.tableData['field'] = data.dataField!;
      this.tableData['sort']  = this.tableData['sort'] === 'desc' ? 'asc' : 'desc';
    } else if (type === 'paginate') {
      this.tableData['paginate'] = (<HTMLInputElement>data.target)?.value;
    } else if (type === 'page') {
      this.tableData['page'] = data;
    } else if (type === 'search') {
      this.tableData['search'] = data;
    } else if(type = 'daterange') {
      if(data) {
        this.tableData['start_date'] = data.start_date;
        this.tableData['end_date'] = data.end_date;
      } else {
        delete this.tableData['start_date'];
        delete this.tableData['end_date'];
      }
    }
    this.renderer.addClass(this.document.body, 'loader-none');
    this.tableChanged.emit(this.tableData);
  }

  onActionClicked(actionType: string, rowData: any, value?: number) {
    this.renderer.addClass(this.document.body, 'loader-none');
    if(this.hasPermission([actionType])) {
      rowData[actionType] = value;
      this.action.emit({actionToPerform: actionType, data: rowData});
    } else {
      rowData[actionType] = value;
      this.action.emit({actionToPerform: actionType, data: rowData});
    }
  }

  onRowClicked(rowData: any): void {
    if(this.hasPermission(['edit', 'view'])) {
      this.rowClicked.emit(rowData);
    }
  } 

  checkUncheckAll(event: Event) {
    this.tableConfig?.data!.forEach((item: any) => {
      if(item.system_reserve != '1') { 
        item.isChecked = (<HTMLInputElement>event?.target)?.checked;
        this.setSelectedItem((<HTMLInputElement>event?.target)?.checked, item?.id);
      };
    });
  }

  onItemChecked(event: Event) {
    this.setSelectedItem((<HTMLInputElement>event.target)?.checked, Number((<HTMLInputElement>event.target)?.value));
  }

  setSelectedItem(checked: Boolean, value: Number) {
    const index = this.selected.indexOf(Number(value));
    if(checked) { 
      if(index == -1) this.selected.push(Number(value)) 
    } else {
      this.selected = this.selected.filter(id => id != Number(value));
    }
    this.selectedItems.emit(this.selected);
  }

  get deleteButtonStatus() {
    let status = false;
    this.tableConfig?.data?.filter((data: any) => {
      if(this.selected.includes(data?.id)) {
        const permission = this.tableConfig?.rowActions?.find(action => action.actionToPerform == 'delete')?.permission as string;
        if(permission && this.permissions?.includes(permission)){
          status = true;
        }
      }
    });
    return status;
  }

  get duplicateButtonStatus() {
    let status = false;
    this.tableConfig?.data?.filter((data: any) => {
      if(this.selected.includes(data?.id)) {
        const permission = this.tableConfig?.rowActions?.find(action => action.actionToPerform == 'edit')?.permission as string;
        if(permission && this.permissions?.includes(permission)){
          status = true;
        }
      }
    });
    return status;
  }

  // For Date Picker

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}

    let params = {
      start_date: `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`,
      end_date: `${this.toDate?.year}-${this.toDate?.month}-${this.toDate?.day}`
    }
    this.onChangeTable(params, 'daterange')
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }

  clearDateRange() {

    this.fromDate = null
    this.toDate = null
    let params = null
    this.onChangeTable(params, 'daterange')
  }

}

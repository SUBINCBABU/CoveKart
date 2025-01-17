import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss']
})
export class DropdownListComponent {

  @Input() data: any;
  @Input() selectedPillIds: number[];
  @Input() key: string;
  @Input() subArrayKey: string;

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() subItemClicked: EventEmitter<any> = new EventEmitter();

  select(data: any) {
    data.selected = !data.selected;
    this.selected.emit(data);
  }

  onArrowClick(event: Event, data: any) {
    event.stopPropagation();
    this.subItemClicked.emit(data);
  }

}

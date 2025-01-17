import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Category } from '../../../shared/interface/category.interface';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {

  @Input() type: string;
  @Input() data: Category[];
  @Input() recursionKey: string;
  @Input() displayKey: string = 'name';
  @Input() categoryType: string | null = 'product';

  public treeSearch = new FormControl('');
  public dataToShow: Category[] = [];

  constructor() {
    this.treeSearch.valueChanges
        .subscribe(
          (data) => {
        if(data) {
            this.dataToShow = [];
            this.data.forEach(item =>{
                this.hasValue(item) && this.dataToShow.push(item)
            })
        } else {
            this.dataToShow = this.data;
        }
    });
  }

  ngOnChanges() {
    this.dataToShow = this.data;
  }

  hasValue(item: any) {
    let valueToReturn = false;
    if(item[this.displayKey].toLowerCase().includes(this.treeSearch?.value?.toLowerCase())){
      valueToReturn = true;
    }
    item[this.recursionKey]?.length && item[this.recursionKey].forEach((child: Category) => {
      if(this.hasValue(child)) {
        valueToReturn = true;
      }
    })
    return valueToReturn;
  }

}

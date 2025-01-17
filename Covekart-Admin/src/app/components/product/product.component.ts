import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Product, ProductModel } from "../../shared/interface/product.interface";
import { ProductState } from '../../shared/state/product.state';
import { GetProducts, UpdateProductStatus, ApproveProductStatus, 
         DeleteProduct, DeleteAllProduct, ReplicateProduct } from '../../shared/action/product.action';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  
  @Select(ProductState.product) product$: Observable<ProductModel>;




  fromDate: NgbDateStruct | null = null;
  toDate: NgbDateStruct | null = null;
  startDate: NgbDateStruct;


  onDateSelection(dateType: 'fromDate' | 'toDate', date: NgbDate): void {
    if (dateType === 'fromDate') {
      this.fromDate = date;
    } else {
      this.toDate = date;
    }
  }

  validateInput(date: NgbDateStruct | null, value: string): NgbDateStruct | null {
    // Add custom date validation logic here
    return date;
  }

  public tableConfig: TableConfig = {
  
    
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "image", dataField: "product_thumbnail", class: 'tbl-image', type: 'image', placeholder: 'assets/images/product.png' },
      { title: "name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "sku", dataField: "sku",  sortable: true, sort_direction: 'desc' },
      { title: "price", dataField: "sale_price", type: 'price', sortable: true, sort_direction: 'desc' },
      { title: "stock", dataField: "stock" },
      { title: "store", dataField: "store_name" },
      { title: "approved", dataField: "is_approved", type: "switch", canAllow: ['admin'] },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "product.edit"  },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "product.destroy"  }
    ],
    data: [] as Product[],
    total: 0
  };

  constructor(private store: Store,
    private router: Router) { 
      const today = new Date();
    this.startDate = { 
      year: today.getFullYear(), 
      month: today.getMonth() + 1, 
      day: today.getDate() 
    };
  }

  ngOnInit() {
   
      this.product$.subscribe(product => {
      let products = product?.data?.filter((element: Product) => {
        
        element.stock = element.stock_status ? `<div class="status-${element.stock_status}"><span>${element.stock_status.replace(/_/g, " ")}</span></div>` : '-';
        element.store_name = element?.store ? element?.store?.store_name : '-';
        return element;
      });
      this.tableConfig.data = product ? products : [];
      this.tableConfig.total = product ? product?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetProducts(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'is_approved')
      this.approve(action.data)
    else if(action.actionToPerform == 'status')
      this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
    else if(action.actionToPerform == 'duplicate')
      this.duplicate(action.data)
  }

  edit(data: Product) {
    this.router.navigateByUrl(`/product/edit/${data.id}`);
  }

  approve(data: Product) {
    this.store.dispatch(new ApproveProductStatus(data.id, data.is_approved));
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  delete(data: Product) {
    this.store.dispatch(new DeleteProduct(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllProduct(ids));
  }

  duplicate(ids: number[]) {
    this.store.dispatch(new ReplicateProduct(ids));
  }

}

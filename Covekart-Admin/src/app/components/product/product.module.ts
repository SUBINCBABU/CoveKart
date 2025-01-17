import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { NgxEditorModule } from 'ngx-editor';

// Components
import { ProductComponent } from './product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FormProductComponent } from './form-product/form-product.component';

// State
import { ProductState } from '../../shared/state/product.state';
import { StoreState } from '../../shared/state/store.state';
import { AttributeState } from '../../shared/state/attribute.state';
import { CategoryState } from '../../shared/state/category.state';
import { TagState } from '../../shared/state/tag.state';
import { TaxState } from '../../shared/state/tax.state';
import { SettingState } from '../../shared/state/setting.state';

@NgModule({
  declarations: [
    ProductComponent,
    CreateProductComponent,
    EditProductComponent,
    FormProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    NgxEditorModule,
    NgxsModule.forFeature([
      ProductState,
      StoreState,
      AttributeState,
      CategoryState,
      TagState,
      TaxState,
      SettingState
    ])
  ]
})
export class ProductModule { }

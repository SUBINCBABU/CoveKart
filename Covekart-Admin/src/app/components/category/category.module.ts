import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { CategoryRoutingModule } from './category-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { CategoryComponent } from './category.component';
import { TreeComponent } from './tree/tree.component';
import { FormCategoryComponent } from './form-category/form-category.component';
import { TreeNodeComponent } from './tree/tree-node/tree-node.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';

// States
import { CategoryState } from '../../shared/state/category.state';

@NgModule({
  declarations: [
    CategoryComponent,
    TreeComponent,
    FormCategoryComponent,
    TreeNodeComponent,
    EditCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    NgxsModule.forFeature([CategoryState])
  ],
  exports: [
    CategoryComponent,
    EditCategoryComponent
  ]
})
export class CategoryModule { }

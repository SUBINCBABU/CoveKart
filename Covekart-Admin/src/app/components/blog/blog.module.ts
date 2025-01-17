import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxEditorModule } from 'ngx-editor';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { CategoryModule } from "../category/category.module";
import { TagModule } from "../tag/tag.module";

// Components
import { BlogComponent } from './blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { FormBlogComponent } from './form-blog/form-blog.component';
import { EditBlogCategoryComponent } from './category/edit-blog-category/edit-blog-category.component';
import { CreateBlogTagComponent } from './tag/create-blog-tag/create-blog-tag.component';
import { EditBlogTagComponent } from './tag/edit-blog-tag/edit-blog-tag.component';
import { BlogCategoryComponent } from './category/blog-category/blog-category.component';
import { BlogTagComponent } from './tag/blog-tag/blog-tag.component';

// States
import { BlogState } from '../../shared/state/blog.state';

@NgModule({
  declarations: [
    BlogComponent,
    EditBlogComponent,
    CreateBlogComponent,
    FormBlogComponent,
    EditBlogCategoryComponent,
    CreateBlogTagComponent,
    EditBlogTagComponent,
    BlogCategoryComponent,
    BlogTagComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    CategoryModule,
    TagModule,
    NgxsModule.forFeature([BlogState]),
    NgxEditorModule
  ]
})
export class BlogModule { }

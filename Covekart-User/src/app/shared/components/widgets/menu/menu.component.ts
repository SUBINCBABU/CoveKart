import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Menu } from '../../../interface/menu.interface';
import { ProductState } from '../../../../shared/state/product.state';
import { Product, ProductModel } from '../../../../shared/interface/product.interface';
import { BlogState } from '../../../../shared/state/blog.state';
import { Blog, BlogModel } from '../../../../shared/interface/blog.interface';
import * as data from '../../../../shared/data/menu'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @Select(ProductState.dealProducts) product$: Observable<Product[]>;
  @Select(BlogState.blog) blog$: Observable<BlogModel>;

  public menu: Menu[] = data.menu;
  public products: Product[];
  public blogs: Blog[];

  constructor(){
    this.product$.subscribe(product => {
      this.products = product.slice(0, 2);
    })

    this.blog$.subscribe(blog =>{
      this.blogs = blog.data.slice(0,2)
    })
  }

  toggle(menu: Menu){
    if(!menu.active){
      this.menu.forEach(item => {
        if(this.menu.includes(menu)){
          item.active = false;
        }
      })
    }
    menu.active = !menu.active;
  }
}

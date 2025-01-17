import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { Product } from '../../../shared/interface/product.interface';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeOptionState } from '../../../shared/state/theme-option.state';
import { Option } from '../../../shared/interface/theme-option.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  @Select(ProductState.selectedProduct) product$: Observable<Product>;
  @Select(ThemeOptionState.themeOptions) themeOptions$: Observable<Option>;

  public breadcrumb: Breadcrumb = {
    title: "Product",
    items: []
  }
  public layout: string = 'product_thumbnail';
  public product: Product;
  public isScrollActive = false;

  constructor(private route: ActivatedRoute, private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.product$.subscribe(product => {
     
      this.breadcrumb.items = [];
      this.breadcrumb.title = product.name;
      this.breadcrumb.items.push({ label: 'Product', active: true }, { label: product.name, active: false });
      this.product = product;
      product?.meta_title && this.meta.updateTag({property: 'og:title', content: product?.meta_title});
      product?.meta_description && this.meta.updateTag({property: 'og:description', content: product?.meta_description});
      product?.product_meta_image && this.meta.updateTag({property: 'og:image', content: product?.product_meta_image.original_url});
      product?.product_meta_image && this.meta.updateTag({property: 'og:image:width', content: '500'});
      product?.product_meta_image && this.meta.updateTag({property: 'og:image:height', content: '500'});
    });

    // For Demo Purpose only
    this.route.queryParams.subscribe(params => {
     
      if(params['layout']) {
        this.layout = params['layout'];
      } else {
        // Get Product Layout
        this.themeOptions$.subscribe(option => {
          this.layout = option?.product && option?.product?.product_layout ? option?.product?.product_layout : 'product_thumbnail';
        });
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      const button = document.querySelector('.scroll-button');
      if (button) {
        const buttonRect = button.getBoundingClientRect();
        if (buttonRect.bottom < window.innerHeight && buttonRect.bottom < 0) {
          this.isScrollActive = true;
          document.body.classList.add('stickyCart');
        } else {
          this.isScrollActive = false;
          document.body.classList.remove('stickyCart');
        }
      }
    }
  }

  ngOnDestroy(){
    document.body.classList.remove('stickyCart')
  }

}

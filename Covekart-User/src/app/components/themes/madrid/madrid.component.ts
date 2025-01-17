import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store  } from '@ngxs/store';
import { forkJoin } from 'rxjs';
import { GetProducts } from '../../../shared/action/product.action';
import { GetBlogs } from '../../../shared/action/blog.action';
import { Madrid } from '../../../shared/interface/theme.interface';
import { ThemeOptionService } from '../../../shared/services/theme-option.service';
import * as data from  '../../../shared/data/owl-carousel';

@Component({
  selector: 'app-madrid',
  templateUrl: './madrid.component.html',
  styleUrls: ['./madrid.component.scss']
})
export class MadridComponent {

  @Input() data?: Madrid;
  @Input() slug?: string;

  public categorySlider = data.categorySlider9;
  public productSlider6Item = data.productSlider6Item;
  public productSlider6ItemMargin = data.productSlider6ItemMargin;
  public customOptionsItem4 = data.customOptionsItem4;

  constructor(private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeOptionService: ThemeOptionService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      if(this.data?.slug == this.slug) {
        // Get Products
        const getProducts$ = this.store.dispatch(new GetProducts({
          status: 1,
          ids: this.data?.content?.products_ids?.join(',')
        }));

        // Get Blogs
        const getBlogs$ = this.store.dispatch(new GetBlogs({
          status: 1,
          ids: this.data?.content?.featured_blogs?.blog_ids?.join(',')
        }));

        // Skeleton Loader
        document.body.classList.add('skeleton-body');

        forkJoin([getProducts$, getBlogs$]).subscribe({
          complete: () => {
            document.body.classList.remove('skeleton-body');
            this.themeOptionService.preloader = false;
          }
        });
      }

      // Change color for this layout
      document.documentElement.style.setProperty('--theme-color', '#239698');
      this.themeOptionService.theme_color = '#239698';
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      // Remove Color
      document.documentElement.style.removeProperty('--theme-color');
    }
  }

}

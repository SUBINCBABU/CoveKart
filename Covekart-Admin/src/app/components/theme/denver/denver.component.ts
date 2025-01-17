import { Component, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, debounceTime, forkJoin } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Select2, Select2Data, Select2SearchEvent } from 'ng-select2-component';
import { GetHomePage, UpdateHomePage } from '../../../shared/action/theme.action';
import { ThemeState } from '../../../shared/state/theme.state';
import { ProductState } from '../../../shared/state/product.state';
import { GetProducts } from '../../../shared/action/product.action';
import { CategoryState } from '../../../shared/state/category.state';
import { GetCategories } from '../../../shared/action/category.action';
import { Denver } from '../../../shared/interface/theme.interface';
import { Params } from '../../../shared/interface/core.interface';
import * as data from '../../../shared/data/home-page'

@Component({
  selector: 'app-denver',
  templateUrl: './denver.component.html',
})
export class DenverComponent {

  @Select(ThemeState.homePage) home_page$: Observable<Denver>;
  @Select(ProductState.products) product$: Observable<Select2Data>;  
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  

  public page_data: Denver;
  public active = 'home_banner';
  public form: FormGroup
  public banner = 1;
  public slider_product = 1;
  public sort = data.sort;
  public product_list_type = data.product_list_type;
  
  private search = new Subject<string>();
  private destroy$ = new Subject<void>();

  public filter = {
    'status': 1,
    'search': '',
    'paginate': 15,
    'ids': '',
    'with_union_products': 0,
    'is_approved': 1
  };

  constructor(private store: Store, 
    public formBuilder: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document){
    this.form = new FormGroup({
      content: new FormGroup({
        home_banner: new FormGroup({
          status: new FormControl(false),
          main_banner: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          })
        }),
        categories_icon_list: new FormGroup({
          status: new FormControl(false),
          category_ids: new FormControl([]),
          image_url: new FormControl(''),
        }),
        products_list_1: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(''),
        }),
        two_column_banners: new FormGroup({
          status: new FormControl(false),
          banner_1: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
          banner_2: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          })
        }),
        slider_product_with_banner: new FormGroup({
          left_side_banners: new FormGroup({
            status: new FormControl(false),
            banner_1: new FormGroup({
              image_url: new FormControl(''),
              redirect_link: new FormGroup({
                link: new FormControl(''),
                link_type: new FormControl(''),
                product_ids: new FormControl(''),
              }),
            })
          }),
          slider_products: new FormGroup({
            status: new FormControl(false),
            product_slider_1: new FormGroup({
              title: new FormControl(''),
              product_ids: new FormControl([]),
              status: new FormControl(false),
            }),
            product_slider_2: new FormGroup({
              title: new FormControl(''),
              product_ids: new FormControl([]),
              status: new FormControl(false),
            }),
            product_slider_3: new FormGroup({
              title: new FormControl(''),
              product_ids: new FormControl([]),
              status: new FormControl(false),
            }),
          }),
        }),
        coupon_banner: new FormGroup({
          image_url: new FormControl(''),
          status: new FormControl(false),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
        }),
        products_list_2: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(false),
        }),
        products_list_3: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(false),
        }),
        news_letter: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(false),
          image_url: new FormControl(''),
          sub_title: new FormControl(''),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('denver')
    })
  }

  ngOnInit() {
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product' }));
    const home_page$ = this.store.dispatch(new GetHomePage({ slug: "denver" }));
    forkJoin([home_page$, categories$]).subscribe({
      complete: () => { 
        this.store.select(ThemeState.homePage).subscribe({
          next: (homePage) => {
            if(homePage?.content?.products_ids){
              this.filter['paginate'] = homePage?.content?.products_ids?.length >= 15 ? homePage?.content?.products_ids?.length: 15;
              this.filter['ids'] = homePage?.content?.products_ids?.join();
              this.filter['with_union_products'] = homePage?.content?.products_ids?.length ? homePage?.content?.products_ids?.length >= 15 ? 0 : 1 : 0; 
            }
            this.store.dispatch(new GetProducts(this.filter)).subscribe({
              complete: () => {
                this.patchForm();
              }
            });
          } 
        });
      }     
    });

    this.search
      .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe((inputValue) => {
        this.store.dispatch(new GetProducts({ status: 1, is_approved: 1, paginate: 15, search: inputValue }));
        this.renderer.addClass(this.document.body, 'loader-none');
    });
  }

  patchForm() {
    this.store.select(ThemeState.homePage).subscribe(homePage => {
      this.page_data = homePage
      this.form.patchValue({
        content: {
          home_banner: {
            main_banner: {
              image_url: homePage?.content?.home_banner?.main_banner?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.main_banner?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.main_banner?.redirect_link?.link_type,
                product_ids: homePage?.content?.home_banner?.main_banner?.redirect_link?.product_ids
              }
            }
          },
          categories_icon_list: {
            status: homePage?.content?.categories_icon_list?.status,
            category_ids: homePage?.content?.categories_icon_list?.category_ids,
            image_url: homePage?.content?.categories_icon_list?.image_url,
          },
          products_list_1: {
            title: homePage?.content?.products_list_1?.title,
            product_ids: homePage?.content?.products_list_1?.product_ids,
            status: homePage?.content?.products_list_1?.status,
          },
          two_column_banners: {
            status: homePage?.content?.two_column_banners?.status,
            banner_1: {
              image_url: homePage?.content?.two_column_banners?.banner_1?.image_url,
              redirect_link: {
                link: homePage?.content?.two_column_banners?.banner_1?.redirect_link?.link,
                link_type: homePage?.content?.two_column_banners?.banner_1?.redirect_link?.link_type,
                product_ids: homePage?.content?.two_column_banners?.banner_1?.redirect_link?.product_ids
              }
            },
            banner_2: {
              image_url: homePage?.content?.two_column_banners?.banner_2?.image_url,
              redirect_link: {
                link: homePage?.content?.two_column_banners?.banner_2?.redirect_link?.link,
                link_type: homePage?.content?.two_column_banners?.banner_2?.redirect_link?.link_type,
                product_ids: homePage?.content?.two_column_banners?.banner_1?.redirect_link?.product_ids
              }
            }
          },
          slider_product_with_banner: {
            slider_products: {
              status: homePage?.content?.slider_product_with_banner?.slider_products?.status,
              product_slider_1: {
                title: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_1?.title,
                product_ids: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_1?.product_ids,
                status: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_1?.status,
              },
              product_slider_2: {
                title: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_2?.title,
                product_ids: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_2?.product_ids,
                status: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_2?.status,
              },
              product_slider_3: {
                title: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_3?.title,
                product_ids: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_3?.product_ids,
                status: homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_3?.status,
              },
            },
            left_side_banners: {
              status: homePage?.content?.slider_product_with_banner?.left_side_banners?.status,
              banner_1: {
                redirect_link: {
                  link: homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1?.redirect_link?.link,
                  link_type: homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1?.redirect_link?.link_type,
                  product_ids: homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1?.redirect_link?.product_ids
                },
                image_url: homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1?.image_url,
              },
            },
          },
          coupon_banner: {
            status: homePage?.content?.coupon_banner?.status,
            image_url: homePage?.content?.coupon_banner?.image_url,
            redirect_link: {
              link: homePage?.content?.coupon_banner?.redirect_link?.link,
              link_type: homePage?.content?.coupon_banner?.redirect_link?.link_type,
              product_ids: homePage?.content?.coupon_banner?.redirect_link?.product_ids
            },
          },
          products_list_2: {
            title: homePage?.content?.products_list_2?.title,
            product_ids: homePage?.content?.products_list_2?.product_ids,
            status: homePage?.content?.products_list_2?.status,
          },
          products_list_3: {
            title: homePage?.content?.products_list_3?.title,
            product_ids: homePage?.content?.products_list_3?.product_ids,
            status: homePage?.content?.products_list_3?.status,
          },
          news_letter: {
            title: homePage?.content?.news_letter?.title,
            status: homePage?.content?.news_letter?.status,
            image_url: homePage?.content?.news_letter?.image_url,
            sub_title: homePage?.content?.news_letter?.sub_title,
          },
          products_ids: homePage?.content?.products_ids,
        },
        slug: homePage?.slug
      })
    })
  }

  getProducts(filter: Params){
    this.filter['search'] = filter['search'];
    this.filter['ids'] = this.filter['search'].length ? '' : this.page_data?.content?.products_ids?.join()
    this.filter['paginate'] = this.page_data?.content?.products_ids?.length >= 15 ? this.page_data?.content?.products_ids?.length: 15;
    this.store.dispatch(new GetProducts(this.filter));
    this.renderer.addClass(this.document.body, 'loader-none');
  }

  productDropdown(event: Select2){
    if(event['innerSearchText']){
      this.search.next('');
      this.getProducts(this.filter);
    }
  }
  
  searchProduct(event: Select2SearchEvent){
    this.search.next(event.search);
  }

  // Merge Products Ids
  concatDynamicProductKeys(obj: Denver) {
    const result: number[]= [];
    function traverse(obj: any) {
      for (const key in obj) {
        if (key === 'product_ids' && Array.isArray(obj[key])) {
          result.push(...obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverse(obj[key]);
        }else {
          if(key === 'product_ids' && obj.product_ids){
            result.push(obj.product_ids)
          };
        }
      }
    }
    traverse(obj);
    return result;
  }
  
  selectBanner(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }

  submit(){
    const productIds = Array.from(new Set(this.concatDynamicProductKeys(this.form.value)));
    this.form.get('content.products_ids')?.setValue(productIds);

    if(this.form.valid) {
      this.store.dispatch(new UpdateHomePage(this.page_data.id, this.form.value));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}




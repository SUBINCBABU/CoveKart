import { Component, Inject, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject, debounceTime, forkJoin } from 'rxjs';
import { Select2, Select2Data, Select2SearchEvent } from 'ng-select2-component';
import { GetProducts } from '../../../shared/action/product.action';
import { GetHomePage, UpdateHomePage } from '../../../shared/action/theme.action';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeState } from '../../../shared/state/theme.state';
import { CategoryState } from '../../../shared/state/category.state';
import { Tokyo } from '../../../shared/interface/theme.interface';
import { Params } from '../../../shared/interface/core.interface';
import * as data from '../../../shared/data/home-page';
import { GetCategories } from '../../../shared/action/category.action';

@Component({
  selector: 'app-tokyo',
  templateUrl: './tokyo.component.html',
  styleUrls: ['./tokyo.component.scss']
})
export class TokyoComponent {

  @Select(ProductState.products) product$: Observable<Select2Data>;
  @Select(ThemeState.homePage) home_page$: Observable<Tokyo>;
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  

  public form: FormGroup;
  public page_data: Tokyo;
  public active = 'home_banner';
  public banner = 1;
  public main_content = 1;
  public sidebar_banner = 1;
  
  public sort = data.sort;
  public product_list_type =  data.product_list_type;
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
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document){
    this.form = new FormGroup({
      content: new FormGroup({
        home_banner: new FormGroup({
          status: new FormControl(true),
          main_banner: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
          sub_banner_1: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
          sub_banner_2: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          })
        }),
        categories_icon_list: new FormGroup({
          image_url: new FormControl(),
          category_ids: new FormControl([]),
          status: new FormControl(false),
        }),
        coupons: new FormGroup({
          status: new FormControl(true),
          image_url: new FormControl(),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
        }),
        featured_banners: new FormGroup({
          status: new FormControl(true),
          banners: new FormArray([])
        }),
        main_content: new FormGroup({
          sidebar: new FormGroup({
            status: new FormControl(true),
            right_side_banners: new FormGroup({
              status: new FormControl(true),
              banner_1: new FormGroup({
                image_url: new FormControl(),
                redirect_link: new FormGroup({
                  link: new FormControl(''),
                  link_type: new FormControl(''),
                  product_ids: new FormControl(''),
                }),
              }),
              banner_2: new FormGroup({
                image_url: new FormControl(),
                redirect_link: new FormGroup({
                  link: new FormControl(''),
                  link_type: new FormControl(''),
                  product_ids: new FormControl(''),
                }),
              })
            })
          }),
          section1_products: new FormGroup({
            title: new FormControl("Enter Title"),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          section2_slider_products: new FormGroup({
            title: new FormControl("Enter Title"),  
            status: new FormControl(true),  
            product_ids: new FormControl([]),
          }),
          section3_products: new FormGroup({
            title: new FormControl("Enter Title"),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          section4_products: new FormGroup({
            title: new FormControl("Enter Title"),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          })
        }),
        full_width_banner: new FormGroup({
          image_url: new FormControl(),
          status: new FormControl(true),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
        }),
        slider_products: new FormGroup({
          status: new FormControl(true),
          product_slider_1: new FormGroup({
            title: new FormControl(),
            product_ids: new FormControl([]),
            status: new FormControl(true),
          }),
          product_slider_2: new FormGroup({
            title: new FormControl(),
            product_ids: new FormControl([]),
            status: new FormControl(true),
          }),
          product_slider_3: new FormGroup({
            title: new FormControl(),
            product_ids: new FormControl([]),
            status: new FormControl(true),
          }),
          product_slider_4: new FormGroup({
            title: new FormControl(),
            product_ids: new FormControl([]),
            status: new FormControl(true),
          }),
        }),
        news_letter: new FormGroup({
          title: new FormControl(),
          sub_title: new FormControl(),
          image_url: new FormControl(),
          status: new FormControl(true),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('tokyo')
    })
  }   
  
  ngOnInit() {
    const home_page$ = this.store.dispatch(new GetHomePage({ slug: "tokyo" }));
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product' }));
    forkJoin([home_page$, categories$]).subscribe({
      complete: () => { 
        this.store.select(ThemeState.homePage).subscribe({
          next: (homePage: any) => {
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

  patchForm(){
    this.home_page$.subscribe(homePage => {
      this.page_data = homePage
      this.form.patchValue({
        content: {
          home_banner: {
            status: homePage?.content?.home_banner?.status,
            main_banner: {
              image_url: homePage?.content?.home_banner?.main_banner?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.main_banner?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.main_banner?.redirect_link?.link_type,
                product_ids: homePage?.content?.home_banner?.main_banner?.redirect_link?.product_ids
              }
            },
            sub_banner_1: {
              image_url: homePage?.content?.home_banner?.sub_banner_1?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.sub_banner_1?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.sub_banner_1?.redirect_link?.link_type,
                product_ids: homePage?.content?.home_banner?.sub_banner_1?.redirect_link?.product_ids
              }
            },
            sub_banner_2: {
              image_url: homePage?.content?.home_banner?.sub_banner_2?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.sub_banner_2?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.sub_banner_2?.redirect_link?.link_type,
                product_ids: homePage?.content?.home_banner?.sub_banner_2?.redirect_link?.product_ids
              }
            }
          },
          categories_icon_list: {
            status: homePage?.content?.categories_icon_list?.status,
            image_url: homePage?.content?.categories_icon_list?.image_url,
            category_ids: homePage?.content?.categories_icon_list?.category_ids,
          },
          coupons: {
            image_url: homePage?.content?.coupons?.image_url,
            status: homePage?.content?.coupons?.status,
            redirect_link: {
              link: homePage?.content?.coupons?.redirect_link?.link,
              link_type: homePage?.content?.coupons?.redirect_link?.link_type,
              product_ids: homePage?.content?.coupons?.redirect_link?.product_ids
            }
          },
          featured_banners: {
            status: homePage?.content?.featured_banners?.status,
          },
          main_content: {
            sidebar: {
              status: homePage?.content?.main_content?.sidebar?.status,
              right_side_banners: {
                status: homePage?.content?.main_content?.sidebar?.right_side_banners?.status,
                banner_1: {
                  image_url: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.image_url,
                  redirect_link: {
                    link: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.redirect_link?.link,
                    link_type: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.redirect_link?.link_type,
                    product_ids: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.redirect_link?.product_ids,
                  }
                },
                banner_2: {
                  image_url: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_2?.image_url,
                  redirect_link: {
                    link: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_2?.redirect_link?.link,
                    link_type: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_2?.redirect_link?.link_type,
                    product_ids: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_2?.redirect_link?.product_ids
                  }
                }
              }
            },
            section1_products: {
              title: homePage?.content?.main_content?.section1_products?.title,
              status: homePage?.content?.main_content?.section1_products?.status,
              product_ids: homePage?.content?.main_content?.section1_products?.product_ids,
            },
            section2_slider_products: {
              title: homePage?.content?.main_content?.section2_slider_products?.title,  
              status: homePage?.content?.main_content?.section2_slider_products?.status,  
              product_ids: homePage?.content?.main_content?.section2_slider_products?.product_ids,
            },
            section3_products: {
              title: homePage?.content?.main_content?.section3_products?.title,
              status: homePage?.content?.main_content?.section3_products?.status,
              product_ids: homePage?.content?.main_content?.section3_products?.product_ids,
            },
            section4_products: {
              title: homePage?.content?.main_content?.section4_products?.title,
              status: homePage?.content?.main_content?.section4_products?.status,
              product_ids: homePage?.content?.main_content?.section4_products?.product_ids,
            }
          },
          full_width_banner: {
            image_url: homePage?.content?.full_width_banner?.image_url,
            status: homePage?.content?.full_width_banner?.status,
            redirect_link: {
              link: homePage?.content?.full_width_banner?.redirect_link?.link,
              link_type: homePage?.content?.full_width_banner?.redirect_link?.link_type,
              product_ids: homePage?.content?.full_width_banner?.redirect_link?.product_ids
            }
          },
          slider_products: {
            status: homePage?.content?.slider_products?.status,
            product_slider_1: {
              title: homePage?.content?.slider_products?.product_slider_1?.title,
              product_ids: homePage?.content?.slider_products?.product_slider_1?.product_ids,
              status: homePage?.content?.slider_products?.product_slider_1?.status,
            },
            product_slider_2: {
              title: homePage?.content?.slider_products?.product_slider_2?.title,
              product_ids: homePage?.content?.slider_products?.product_slider_2?.product_ids,
              status: homePage?.content?.slider_products?.product_slider_2?.status,
            },
            product_slider_3: {
              title: homePage?.content?.slider_products?.product_slider_3?.title,
              product_ids: homePage?.content?.slider_products?.product_slider_3?.product_ids,
              status: homePage?.content?.slider_products?.product_slider_3?.status,
            },
            product_slider_4: {
              title: homePage?.content?.slider_products?.product_slider_4?.title,
              product_ids: homePage?.content?.slider_products?.product_slider_4?.product_ids,
              status: homePage?.content?.slider_products?.product_slider_4?.status,
            },
          },
          news_letter: {
            title: homePage?.content?.news_letter?.title,
            sub_title: homePage?.content?.news_letter?.sub_title,
            image_url: homePage?.content?.news_letter?.image_url,
            status: homePage?.content?.news_letter?.status,
          },
          products_ids: homePage?.content?.products_ids,
        },
        slug: homePage?.slug
      })  

      this.bannersArray.clear();
      homePage?.content?.featured_banners?.banners?.forEach(banner => 
      this.bannersArray.push(
        this.formBuilder.group({
          redirect_link: new FormGroup({
            link: new FormControl(banner?.redirect_link?.link),
            link_type: new FormControl(banner?.redirect_link?.link_type),
            product_ids: new FormControl(banner?.redirect_link?.product_ids),
          }),
          image_url: new FormControl(banner?.image_url),
          status: new FormControl(banner?.status),
        })
      ));
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

  get bannersArray(): FormArray {
    return this.form.get('content.featured_banners.banners') as FormArray
  }

  addBanner(event: Event) {
    event.preventDefault();
    this.bannersArray.push(
      this.formBuilder.group({
        redirect_link: new FormControl({
          link: new FormControl(''),
          link_type: new FormControl(''),
          product_ids: new FormControl(''),
        }),
        image_url: new FormControl(),
        status: new FormControl(true),
      })
    );
  }

  selectImage(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null)
  }

  selectBannerArray(url: string, index: number){
    this.bannersArray.at(index).get('image_url')?.setValue(url ? url : null);
  }

  remove(index: number) {
    if(this.bannersArray.length <= 2) return
      this.bannersArray.removeAt(index);
  }
    
  // Merge Products Ids
  concatDynamicProductKeys(obj: Tokyo) {
    const result: number[]= [];
    function traverse(obj: any) {
      for (const key in obj) {
        if (key === 'product_ids' && Array.isArray(obj[key])) {
          result.push(...obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverse(obj[key]);
        } else {
          if(key === 'product_ids' && obj.product_ids){
            result.push(obj.product_ids)
          };
        }
      }
    }
    traverse(obj);
    return result;
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

import { Component, Inject, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject, debounceTime, forkJoin } from 'rxjs';
import { Select2, Select2Data, Select2SearchEvent } from 'ng-select2-component';
import { GetProducts } from '../../../shared/action/product.action';
import { GetHomePage, UpdateHomePage } from '../../../shared/action/theme.action';
import { GetCategories } from '../../../shared/action/category.action';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeState } from '../../../shared/state/theme.state';
import { CategoryState } from '../../../shared/state/category.state';
import { Berlin, Services } from '../../../shared/interface/theme.interface';
import { Params } from '../../../shared/interface/core.interface';
import * as data from '../../../shared/data/home-page';

@Component({
  selector: 'app-berlin',
  templateUrl: './berlin.component.html',
})
export class BerlinComponent {

  @Select(ProductState.products) product$: Observable<Select2Data>;  
  @Select(ThemeState.homePage) home_page$: Observable<Berlin>;
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  
  
  public form: FormGroup
  public page_data: Berlin;
  public active = 'home_banner';
  public banner = 1;
  
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
    public formBuilder: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document){
    this.store.dispatch(new GetHomePage({slug: "berlin"}));

    this.form = new FormGroup({
      content: new FormGroup({
        home_banner: new FormGroup({
          status: new FormControl(true),
          main_banner: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
          sub_banner_1: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
        }),
        services_banner: new FormGroup({
          status: new FormControl(true),
          services: new FormArray([])
        }),
        main_content: new FormGroup({
          status: new FormControl(true),
          sidebar: new FormGroup({
            status: new FormControl(true),
            categories_icon_list: new FormGroup({
              title: new FormControl(''),
              category_ids: new FormControl([]),
              status: new FormControl(true),
            }),
            right_side_banners: new FormGroup({
              status: new FormControl(true),
              banner_1: new FormGroup({
                redirect_link: new FormGroup({
                  link: new FormControl(''),
                  link_type: new FormControl(''),
                  product_ids: new FormControl(''),
                }),
                image_url: new FormControl(''),
              })
            }),
            sidebar_products: new FormGroup({
              title: new FormControl(''),
              status: new FormControl(true),
              product_ids: new FormControl([]),
            })
          }),
          section1_products: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            product_ids: new FormControl([]),
            status: new FormControl(true),
          }),
          section2_categories_icon_list: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            image_url: new FormControl(''),
            category_ids: new FormControl([]),
            status: new FormControl(true),
          }),
          section3_two_column_banners: new FormGroup({
            status: new FormControl(true),
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
          section4_products: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
        }),
        full_width_banner: new FormGroup({
          image_url: new FormControl(''),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
        }),
        product_list_1: new FormGroup({
          title: new FormControl(''),
          description: new FormControl(''),
          status: new FormControl(true),
          product_ids: new FormControl([]),
        }),
        news_letter: new FormGroup({
          title: new FormControl(''),
          sub_title: new FormControl(''),
          image_url: new FormControl(''),
          status: new FormControl(true),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('berlin')
    })
  }

  ngOnInit() {
    const home_page$ = this.store.dispatch(new GetHomePage({ slug: "berlin" }));
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product' }));
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
      this.page_data = homePage;
      if(homePage){
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
            },
            services_banner: {
            },
            main_content: {
              status: homePage?.content?.main_content?.status,
              sidebar: {
                status: homePage?.content?.main_content?.sidebar?.status,
                categories_icon_list: {
                  title: homePage?.content?.main_content?.sidebar?.categories_icon_list?.title,
                  category_ids: homePage?.content?.main_content?.sidebar?.categories_icon_list?.category_ids,
                  status: homePage?.content?.main_content?.sidebar?.categories_icon_list?.status,
                },
                right_side_banners: {
                  status: homePage?.content?.main_content?.sidebar?.right_side_banners?.status,
                  banner_1: {
                    redirect_link: {
                      link: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.redirect_link?.link,
                      link_type: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.redirect_link?.link_type,
                      product_ids: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.redirect_link?.product_ids
                    },
                    image_url: homePage?.content?.main_content?.sidebar?.right_side_banners?.banner_1?.image_url,
                  }
                },
                sidebar_products: {
                  title: homePage?.content?.main_content?.sidebar?.sidebar_products?.title,
                  description: homePage?.content?.main_content?.sidebar?.sidebar_products?.description,
                  status: homePage?.content?.main_content?.sidebar?.sidebar_products?.status,
                  product_ids: homePage?.content?.main_content?.sidebar?.sidebar_products?.product_ids,
                }
              },
              section1_products: {
                title: homePage?.content?.main_content?.section1_products?.title,
                description: homePage?.content?.main_content?.section1_products?.description,
                product_ids: homePage?.content?.main_content?.section1_products?.product_ids,
                status: homePage?.content?.main_content?.section1_products?.status,
              },
              section2_categories_icon_list: {
                title: homePage?.content?.main_content?.section2_categories_icon_list?.title,
                description: homePage?.content?.main_content?.section2_categories_icon_list?.description,
                category_ids: homePage?.content?.main_content?.section2_categories_icon_list?.category_ids,
                image_url: homePage?.content?.main_content?.section2_categories_icon_list?.image_url,
                status: homePage?.content?.main_content?.section2_categories_icon_list?.status,
              },
              section3_two_column_banners: {
                status: homePage?.content?.main_content?.section3_two_column_banners?.status,
                banner_1: {
                  image_url: homePage?.content?.main_content?.section3_two_column_banners?.banner_1?.image_url,
                  redirect_link: {
                    link: homePage?.content?.main_content?.section3_two_column_banners?.banner_1?.redirect_link?.link,
                    link_type: homePage?.content?.main_content?.section3_two_column_banners?.banner_1?.redirect_link?.link_type,
                    product_ids: homePage?.content?.main_content?.section3_two_column_banners?.banner_1?.redirect_link?.product_ids
                  }
                },
                banner_2: {
                  image_url: homePage?.content?.main_content?.section3_two_column_banners?.banner_2?.image_url,
                  redirect_link: {
                    link: homePage?.content?.main_content?.section3_two_column_banners?.banner_2?.redirect_link?.link,
                    link_type: homePage?.content?.main_content?.section3_two_column_banners?.banner_2?.redirect_link?.link_type,
                    product_ids: homePage?.content?.main_content?.section3_two_column_banners?.banner_2?.redirect_link?.product_ids
                  }
                }
              },
              section4_products: {
                title: homePage?.content?.main_content?.section4_products?.title,
                description: homePage?.content?.main_content?.section4_products?.description,
                status: homePage?.content?.main_content?.section4_products?.status,
                product_ids: homePage?.content?.main_content?.section4_products?.product_ids,
              },
            },
            full_width_banner: {
              image_url: homePage?.content?.full_width_banner?.image_url,
              redirect_link: {
                link: homePage?.content?.full_width_banner?.redirect_link?.link,
                link_type: homePage?.content?.full_width_banner?.redirect_link?.link_type,
                product_ids: homePage?.content?.full_width_banner?.redirect_link?.product_ids
              }
            },
            product_list_1: {
              title: homePage?.content?.product_list_1?.title,
              description: homePage?.content?.product_list_1?.description,
              status: homePage?.content?.product_list_1?.status,
              product_ids: homePage?.content?.product_list_1?.product_ids,
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
        });
        this.serviceArray?.clear();
        homePage?.content?.services_banner?.services.forEach((services: Services) => 
        this.serviceArray.push(
          this.formBuilder.group({
            title: new FormControl(services?.title),
            sub_title: new FormControl(services?.sub_title),
            status: new FormControl(services?.status),
            image_url: new FormControl(services?.image_url),
          })
        ));
      }
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

  get serviceArray(): FormArray {
    return this.form.get('content.services_banner.services') as FormArray;
  }

  selectBanner(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }
  
  addService(event: Event){
    event.preventDefault();
    this.serviceArray?.push(
      this.formBuilder.group({
        title: new FormControl('Text Here'),
        sub_title: new FormControl(''),
        status: new FormControl(true),
        image_url: new FormControl(''),
      })
    );
  }

  selectServiceImage(url: string, index: number){
    this.serviceArray.at(index).get('image_url')?.setValue(url ? url : null);
  }

  // Merge Products Ids
  concatDynamicProductKeys(obj: Berlin) {
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

  removeService(index: number) {
    if(this.serviceArray.length <= 1) return
      this.serviceArray.removeAt(index);
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

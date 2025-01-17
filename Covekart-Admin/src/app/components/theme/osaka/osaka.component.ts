import { Component, Inject, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject, debounceTime, forkJoin } from 'rxjs';
import { Select2, Select2Data, Select2SearchEvent } from 'ng-select2-component';
import { GetBlogs } from '../../../shared/action/blog.action';
import { GetProducts } from '../../../shared/action/product.action';
import { GetHomePage, UpdateHomePage } from '../../../shared/action/theme.action';
import { BlogState } from '../../../shared/state/blog.state';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeState } from '../../../shared/state/theme.state';
import { CategoryState } from '../../../shared/state/category.state';
import { GetCategories } from '../../../shared/action/category.action';
import { Bundles, Osaka } from '../../../shared/interface/theme.interface';
import { Params } from '../../../shared/interface/core.interface';
import * as data from '../../../shared/data/home-page'

@Component({
  selector: 'app-osaka',
  templateUrl: './osaka.component.html',
})
export class OsakaComponent {

  @Select(BlogState.blogs) blogs$: Observable<Select2Data>;
  @Select(ProductState.products) product$: Observable<Select2Data>;
  @Select(ThemeState.homePage) home_page$: Observable<Osaka>;
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  

  public form: FormGroup
  public active = 'home_banner';
  public page_data: Osaka;
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
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document){
    this.form = new FormGroup({
      content: new FormGroup({
        home_banner: new FormGroup({
          status: new FormControl(''),
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
          })
        }),
        categories_icon_list: new FormGroup({
          title: new FormControl(''),
          description: new FormControl(''),
          image_url: new FormControl(''),
          category_ids: new FormControl([]),
          status: new FormControl(true),
        }),
        coupons: new FormGroup({
          image_url: new FormControl(''),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
          status: new FormControl(true),
        }),
        products_list_1: new FormGroup({
          title: new FormControl(''),
          description: new FormControl(''),
          status: new FormControl(true),
          product_ids: new FormControl([]),
        }),
        offer_banner: new FormGroup({
          image_url: new FormControl(''),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
          status: new FormControl(true),
        }),
        products_list_2: new FormGroup({
          title: new FormControl(''),
          description: new FormControl(''),
          status: new FormControl(true),
          product_ids: new FormControl([]),
        }),
        product_bundles: new FormGroup({
          status: new FormControl(true),
          bundles: new FormArray([])
        }),
        slider_products: new FormGroup({
          status: new FormControl(true),
          product_slider_1: new FormGroup({
            title: new FormControl(''),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          product_slider_2: new FormGroup({
            title: new FormControl(''),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          product_slider_3: new FormGroup({
            title: new FormControl(''),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          product_slider_4: new FormGroup({
            title: new FormControl(''),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
        }),
        featured_blogs: new FormGroup({
          title: new FormControl(''),
          description: new FormControl(''),
          status: new FormControl(true),
          blog_ids: new FormControl([]),
        }),
        news_letter: new FormGroup({
          title: new FormControl(''),
          sub_title: new FormControl(''),
          image_url: new FormControl(''),
          status: new FormControl(true),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('osaka')
    })
  }

  ngOnInit() {
    const blogs$ = this.store.dispatch(new GetBlogs());
    const home_page$ = this.store.dispatch(new GetHomePage({slug: "osaka"}));
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product'}));

    forkJoin([blogs$, home_page$, categories$]).subscribe({
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

  get addBundlesArray(): FormArray {
    return this.form.get('content.product_bundles.bundles') as FormArray
  }

  patchForm() {
    this.store.select(ThemeState.homePage).subscribe(homePage => {
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
                product_ids: homePage?.content?.home_banner?.sub_banner_1?.redirect_link?.link_type
              }
            }
          },
          categories_icon_list: {
            title: homePage?.content?.categories_icon_list?.title,
            description: homePage?.content?.categories_icon_list?.description,
            image_url: homePage?.content?.categories_icon_list?.image_url,
            category_ids: homePage?.content?.categories_icon_list?.category_ids,
            status: homePage?.content?.categories_icon_list?.status,
          },
          coupons: {
            status: homePage?.content?.coupons?.status,
            image_url: homePage?.content?.coupons?.image_url,
            redirect_link: {
              link: homePage?.content?.coupons?.redirect_link?.link,
              link_type: homePage?.content?.coupons?.redirect_link?.link_type,
              product_ids: homePage?.content?.coupons?.redirect_link?.product_ids
            }
          },
          products_list_1: {
            title: homePage?.content?.products_list_1?.title,
            description: homePage?.content?.products_list_1?.description,
            status: homePage?.content?.products_list_1?.status,
            product_ids: homePage?.content?.products_list_1?.product_ids,
          },
          offer_banner: {
            status: homePage?.content?.offer_banner?.status,
            image_url: homePage?.content?.offer_banner?.image_url,
            redirect_link: {
              link: homePage?.content?.offer_banner?.redirect_link?.link,
              link_type: homePage?.content?.offer_banner?.redirect_link?.link_type,
              product_ids: homePage?.content?.offer_banner?.redirect_link?.product_ids
            }
          },
          products_list_2: {
            title: homePage?.content?.products_list_2?.title,
            description: homePage?.content?.products_list_2?.description,
            status:  homePage?.content?.products_list_2?.status,
            product_ids: homePage?.content?.products_list_2?.product_ids,
          },
          product_bundles: {
            status: homePage?.content?.product_bundles?.status,
          },
          slider_products: {
            status: homePage?.content?.slider_products?.status,
            product_slider_1: {
              title: homePage?.content?.slider_products?.product_slider_1?.title,
              status: homePage?.content?.slider_products?.product_slider_1?.status,
              product_ids: homePage?.content?.slider_products?.product_slider_1?.product_ids,
            },
            product_slider_2: {
              title: homePage?.content?.slider_products?.product_slider_2?.title,
              status: homePage?.content?.slider_products?.product_slider_2?.status,
              product_ids: homePage?.content?.slider_products?.product_slider_2?.product_ids,
            },
            product_slider_3: {
              title: homePage?.content?.slider_products?.product_slider_3?.title,
              status: homePage?.content?.slider_products?.product_slider_3?.status,
              product_ids: homePage?.content?.slider_products?.product_slider_3?.product_ids,
            },
            product_slider_4: {
              title: homePage?.content?.slider_products?.product_slider_4?.title,
              status: homePage?.content?.slider_products?.product_slider_4?.status,
              product_ids: homePage?.content?.slider_products?.product_slider_4?.product_ids,
            },
          },
          featured_blogs: {
            title: homePage?.content?.featured_blogs?.title,
            description: homePage?.content?.featured_blogs?.description,
            status: homePage?.content?.featured_blogs?.status,
            blog_ids: homePage?.content?.featured_blogs?.blog_ids,
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
        
      this.addBundlesArray?.clear();
      homePage?.content?.product_bundles?.bundles?.forEach((bundles: Bundles) => 
      this.addBundlesArray?.push(
        this.formBuilder.group({
          title: new FormControl(bundles?.title),
          sub_title: new FormControl(bundles?.sub_title),
          image_url: new FormControl(bundles?.image_url),
          redirect_link: new FormGroup({
            link: new FormControl(bundles?.redirect_link?.link),
            link_type: new FormControl(bundles?.redirect_link?.link_type),
            product_ids: new FormControl(bundles?.redirect_link?.product_ids),
          }),
          status: new FormControl(bundles?.status),
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

 

  addBundles(event: Event) {
    event.preventDefault();
    this.addBundlesArray.push(
      this.formBuilder.group({
        title: new FormControl('Text Here'),
        sub_title: new FormControl(''),
        button_text: new FormControl(''),
        image_url: new FormControl(''),
        status: new FormControl(true),
      })
    );
  }

  selectImage(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }

  selectBannerArray(url: string, index: number){
    this.addBundlesArray.at(index).get('image_url')?.setValue(url ? url : null);
  }

  remove(index: number) {
    if(this.addBundlesArray.length <= 1) return
      this.addBundlesArray.removeAt(index);
  }

   // Merge Products Ids
  concatDynamicProductKeys(obj: Osaka) {
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

  submit(){
    const productIds = Array.from(new Set(this.concatDynamicProductKeys(this.form.value)));
    this.form.get('content.products_ids')?.setValue(productIds);

    if(this.form.valid){
      this.store.dispatch(new UpdateHomePage(this.page_data.id, this.form.value))
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

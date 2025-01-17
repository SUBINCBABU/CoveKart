import { Component, Inject, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject, debounceTime, forkJoin } from 'rxjs';
import { Select2, Select2Data, Select2SearchEvent } from 'ng-select2-component';
import { GetBlogs } from '../../../shared/action/blog.action';
import { GetCategories } from '../../../shared/action/category.action';
import { GetProducts } from '../../../shared/action/product.action';
import { GetHomePage, UpdateHomePage } from '../../../shared/action/theme.action';
import { BlogState } from '../../../shared/state/blog.state';
import { CategoryState } from '../../../shared/state/category.state';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeState } from '../../../shared/state/theme.state';
import { Madrid, Banners, Offer, Deal } from '../../../shared/interface/theme.interface';
import { Params } from '../../../shared/interface/core.interface';

@Component({
  selector: 'app-madrid',
  templateUrl: './madrid.component.html',
})
export class MadridComponent {

  @Select(ProductState.products) product$: Observable<Select2Data>;  
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  
  @Select(BlogState.blogs) blogs$: Observable<Select2Data>;
  @Select(ThemeState.homePage) home_page$: Observable<Madrid>;
  
  public form: FormGroup;
  public page_data: Madrid;
  public active = 'home_banner';
  public banner = 1;
  public delivery_banner = 1;
  public deals = 1;
  
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
          status: new FormControl(true),
          main_banner: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
        }),
        featured_banners:  new FormGroup({
          status: new FormControl(true), 
          banners: new FormArray([])
        }),
        categories_image_list: new FormGroup({
          title: new FormControl(''),
          category_ids: new FormControl([]),
          status: new FormControl(true),
        }),
        products_list_1: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(true),
        }),
        bank_wallet_offers: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          offers: new FormArray([])
        }),
        product_with_deals: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          products_list: new FormGroup({
            title: new FormControl(''),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          deal_of_days: new FormGroup({
            title: new FormControl(''),
            status: new FormControl(true),
            image_url: new FormControl(''),
            label: new FormControl(''),
            deals: new FormArray([]),
          })
        }),
        full_width_banner: new FormGroup({
          image_url: new FormControl(''),
          status: new FormControl(true),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
        }),
        products_list_2: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(true),
        }),
        products_list_3: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(true),
        }),
        two_column_banners: new FormGroup({
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
          }),
        }),
        products_list_4: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          product_ids: new FormControl([]),
        }),
        products_list_5: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          product_ids: new FormControl([]),
        }),
        delivery_banners: new FormGroup({
          status: new FormControl(true),
          banner_1: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
            }),
          }),
          banner_2: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
        }),
        products_list_6: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          product_ids: new FormControl([]),
        }),
        products_list_7: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          product_ids: new FormControl([]),
        }),
        featured_blogs: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          blog_ids: new FormControl([]),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('madrid')
    })
  }    

  ngOnInit() {
    const blogs$ = this.store.dispatch(new GetBlogs({ status: 1 }));
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product' }));
    const home_page$ = this.store.dispatch(new GetHomePage({ slug: "madrid" }));
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
                product_ids: homePage?.content?.home_banner?.main_banner?.redirect_link?.product_ids,
              }
            },
          },
          featured_banners: {
            status: homePage?.content?.featured_banners?.status,
          },
          categories_image_list: {
            title: homePage?.content?.categories_image_list?.title,
            category_ids: homePage?.content?.categories_image_list?.category_ids,
            status: homePage?.content?.categories_image_list?.status,
          },
          products_list_1: {
            title: homePage?.content?.products_list_1?.title,
            product_ids: homePage?.content?.products_list_1?.product_ids,
            status: homePage?.content?.products_list_1?.status,
          },
          bank_wallet_offers: {
            title: homePage?.content?.bank_wallet_offers?.title,
            status: homePage?.content?.bank_wallet_offers?.status,
          },
          product_with_deals: {
            title: homePage?.content?.product_with_deals?.title,
            status: homePage?.content?.product_with_deals?.status,
            products_list: {
              title: homePage?.content?.product_with_deals?.products_list?.title,
              status: homePage?.content?.product_with_deals?.products_list?.status,
              product_ids: homePage?.content?.product_with_deals?.products_list?.product_ids,
            },
            deal_of_days: {
              image_url: homePage?.content?.product_with_deals?.deal_of_days?.image_url,
              title: homePage?.content?.product_with_deals?.deal_of_days?.title,
              label: homePage?.content?.product_with_deals?.deal_of_days?.label,
              status: homePage?.content?.product_with_deals?.deal_of_days?.status,
            }
          },
          full_width_banner: {
            image_url: homePage?.content?.full_width_banner?.image_url,
            redirect_link: {
              link: homePage?.content?.full_width_banner?.redirect_link?.link,
              link_type: homePage?.content?.full_width_banner?.redirect_link?.link_type,
              product_ids: homePage?.content?.full_width_banner?.redirect_link?.product_ids,
            },
            status: homePage?.content?.full_width_banner?.status,
          },
          products_list_2: {
            title: homePage?.content?.products_list_2?.title,
            product_ids: homePage?.content?.products_list_2?.product_ids,
            status: homePage?.content?.products_list_2?.status,
          },
          products_list_3: {
            title: homePage?.content?.products_list_3?.title,
            status: homePage?.content?.products_list_3?.status,
            product_ids: homePage?.content?.products_list_3?.product_ids,
          },
          two_column_banners: {
            status: homePage?.content?.two_column_banners?.status,
            banner_1: {
              button_text: homePage?.content?.two_column_banners?.banner_1?.button_text,
              image_url: homePage?.content?.two_column_banners?.banner_1?.image_url,
            },
            banner_2: {
              button_text: homePage?.content?.two_column_banners?.banner_2?.button_text,
              image_url: homePage?.content?.two_column_banners?.banner_2?.image_url,
            },
          },
          products_list_4: {
            title: homePage?.content?.products_list_4?.title,
            status: homePage?.content?.products_list_4?.status,
            product_ids: homePage?.content?.products_list_4?.product_ids,
          },
          products_list_5: {
            title: homePage?.content?.products_list_5?.title,
            status: homePage?.content?.products_list_5?.status,
            product_ids: homePage?.content?.products_list_5?.product_ids,
          },
          delivery_banners: {
            status: homePage?.content?.delivery_banners?.status,
            banner_1: {
              image_url: homePage?.content?.delivery_banners?.banner_1?.image_url,
              redirect_link: {
                link: homePage?.content?.delivery_banners?.banner_1?.redirect_link?.link,
                link_type: homePage?.content?.delivery_banners?.banner_1?.redirect_link?.link_type,
                product_ids: homePage?.content?.delivery_banners?.banner_1?.redirect_link?.product_ids,
              }
            },
            banner_2: {
              image_url: homePage?.content?.delivery_banners?.banner_2?.image_url,
              redirect_link: {
                link: homePage?.content?.delivery_banners?.banner_2?.redirect_link?.link,
                link_type: homePage?.content?.delivery_banners?.banner_2?.redirect_link?.link_type,
                product_ids: homePage?.content?.delivery_banners?.banner_1?.redirect_link?.product_ids,
              }
            },
          },
          products_list_6: {
            title: homePage?.content?.products_list_6?.title,
            status: homePage?.content?.products_list_6?.status,
            product_ids: homePage?.content?.products_list_6?.product_ids,
          },
          products_list_7: {
            title: homePage?.content?.products_list_7?.title,
            product_ids: homePage?.content?.products_list_7?.product_ids,
            status: homePage?.content?.products_list_7?.status,
          },
          featured_blogs: {
            title: homePage?.content?.featured_blogs?.title,
            status: homePage?.content?.featured_blogs?.status,
            blog_ids: homePage?.content?.featured_blogs?.blog_ids,
          },
          products_ids: homePage?.content?.products_ids,
        },
        slug: homePage?.slug
      })

      this.bankWalletOffers.clear()
      homePage?.content?.bank_wallet_offers?.offers.forEach((offers: Offer) => 
      this.bankWalletOffers.push(
        this.formBuilder.group({
          coupon_code: new FormControl(offers?.coupon_code),
          redirect_link: new FormGroup({
            link: new FormControl(offers?.redirect_link?.link),
            link_type: new FormControl(offers?.redirect_link?.link_type),
            product_ids: new FormControl(offers?.redirect_link?.product_ids),
          }),
          image_url: new FormControl(offers?.image_url),
          status: new FormControl(offers?.status),
        })
      ));

      this.bannersArray.clear();
      homePage?.content?.featured_banners?.banners?.forEach((banners: Banners) => 
      this.bannersArray.push(
        this.formBuilder.group({
          redirect_link: new FormGroup({
            link: new FormControl(banners?.redirect_link?.link),
            link_type: new FormControl(banners?.redirect_link?.link_type),
            product_ids: new FormControl(banners?.redirect_link?.product_ids),
          }),
          image_url: new FormControl(banners?.image_url),
          status: new FormControl(banners?.status),
        })
      ));

      this.dealOfDaysArray.clear()
      homePage?.content?.product_with_deals?.deal_of_days?.deals.forEach((deals: Deal) => 
      this.dealOfDaysArray.push(
        this.formBuilder.group({
          offer_title: new FormControl(deals?.offer_title),
          product_id: new FormControl(deals?.product_id),
          end_date: new FormControl(deals?.end_date),
          status: new FormControl(true),
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

  get bankWalletOffers(): FormArray {
    return this.form.get('content.bank_wallet_offers.offers') as FormArray
  }

  get dealOfDaysArray(): FormArray {
    return this.form.get('content.product_with_deals.deal_of_days.deals') as FormArray
  }

  addBanner(event: Event) {
    event.preventDefault();
    this.bannersArray.push(
      this.formBuilder.group({
        redirect_link: new FormGroup({
          link: new FormControl(''),
          link_type: new FormControl(''),
          product_ids: new FormControl(''),
        }),
        status: new FormControl(Number),
        image_url: new FormControl(''),
      })
    );
  }

  addBnkWalletOffers(event: Event) {
    event.preventDefault();
    this.bankWalletOffers.push(
      this.formBuilder.group({
        coupon_code: new FormControl(''),
        redirect_link: new FormGroup({
          link: new FormControl(''),
          link_type: new FormControl(''),
          product_ids: new FormControl(''),
        }),
        image_url: new FormControl(''),
        status: new FormControl(true),
      })
    );
  }  

  AddDeals(event: Event){
    event.preventDefault();
    this.dealOfDaysArray.push(
      this.formBuilder.group({
        label: new FormControl(''),
        offer_title: new FormControl(''),
        product_id: new FormControl(Number),
        status: new FormControl(true),
        end_date: new FormControl(''),
      })
    );
  }

  selectBanner(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null)
  }
  
  selectBannerArray(url: string, index: number){
    this.bannersArray.at(index).get('image_url')?.setValue(url ? url : null);
  }

  selectOfferArray(url: string, index: number){
    this.bankWalletOffers.at(index).get('image_url')?.setValue(url ? url : null);
  }

  remove(index: number) {
    if(this.bannersArray.length <= 1) return
      this.bannersArray.removeAt(index);
  }
  
  removeOffers(index: number) {
    if(this.bankWalletOffers.length <= 1) return
      this.bankWalletOffers.removeAt(index);
  }

  removeDeals(index: number) {
    if(this.dealOfDaysArray.length <= 0) return
      this.dealOfDaysArray.removeAt(index);
  }

  // Merge Products Ids
  concatDynamicProductKeys(obj: Madrid) {
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

    if(this.form.valid) {
      this.store.dispatch(new UpdateHomePage(this.page_data?.id, this.form.value));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

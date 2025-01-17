import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetProducts, GetStoreProducts, 
         GetRelatedProducts, GetProductBySlug, GetDealProducts } from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { ThemeOptionService } from "../services/theme-option.service";

export class ProductStateModel {
  product = {
    data: [] as Product[],
    total: 0
  }
  selectedProduct: Product | null;
  categoryProducts: Product[] | [];
  relatedProducts: Product[] | [];
  storeProducts: Product[] | [];
  dealProducts: Product[] | [];
}

@State<ProductStateModel>({
  name: "product",
  defaults: {
    product: {
      data: [],
      total: 0
    },
    selectedProduct: null,
    categoryProducts: [],
    relatedProducts: [],
    storeProducts: [],
    dealProducts: []
  },
})
@Injectable()
export class ProductState {

  constructor(private store: Store, private router: Router,
    private productService: ProductService, 
    private themeOptionService: ThemeOptionService) {}

  @Selector()
  static product(state: ProductStateModel) {
    return state.product;
  }

  @Selector()
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static relatedProducts(state: ProductStateModel) {
    return state.relatedProducts;
  }

  @Selector()
  static storeProducts(state: ProductStateModel) {
    return state.storeProducts;
  }

  @Selector()
  static dealProducts(state: ProductStateModel) {
    return state.dealProducts;
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    this.productService.skeletonLoader = true;
   
    return this.productService.getProducts(action.payload).pipe(
      tap({

        next: (result: ProductModel) => {
        
          let products = result.data || [];
          if(action?.payload) {
          
            products = result.data.filter(product => 
              (action?.payload?.['store_slug'] && product?.store?.slug == action?.payload?.['store_slug']) ||
              (
                action?.payload?.['category'] && product?.categories?.length &&
                product?.categories?.some(category => action?.payload?.['category']?.split(',')?.includes(category.slug))
              )
            )

            products = products.length ? products : result.data;

            if(action?.payload?.['sortBy']) {
              if(action?.payload?.['sortBy'] === 'asc') {
                products = products.sort((a, b) => {
                  if (a.id < b.id) {
                    return -1;
                  } else if (a.id > b.id) {
                    return 1;
                  }
                  return 0;
                })
              } else if(action?.payload?.['sortBy'] === 'desc') {
                products = products.sort((a, b) => {
                  if (a.id > b.id) {
                    return -1;
                  } else if (a.id < b.id) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'a-z') {
                products = products.sort((a, b) => {
                  if (a.name < b.name) {
                    return -1;
                  } else if (a.name > b.name) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'z-a') {
                products = products.sort((a, b) => {
                  if (a.name > b.name) {
                    return -1;
                  } else if (a.name < b.name) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'low-high') {
                products = products.sort((a, b) => {
                  if (a.sale_price < b.sale_price) {
                    return -1;
                  } else if (a.price > b.price) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'high-low') {
                products = products.sort((a, b) => {
                  if (a.sale_price > b.sale_price) {
                    return -1;
                  } else if (a.price < b.price) {
                    return 1;
                  }
                  return 0;
                })
              } 
            } else if(!action?.payload?.['ids']) {
              products = products.sort((a, b) => {
                if (a.id < b.id) {
                  return -1;
                } else if (a.id > b.id) {
                  return 1;
                }
                return 0;
              })
            }

            if(action?.payload?.['search']) {
              products = products.filter(product => product.name.toLowerCase().includes(action?.payload?.['search'].toLowerCase()))
            }
          } 

          ctx.patchState({
            product: {
              data: products,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        complete: () => {
          this.productService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetRelatedProducts)
  getRelatedProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    this.themeOptionService.preloader = true;
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
      
          
          const state = ctx.getState();
          const products = result.data.filter(product => 
              action?.payload?.['ids']?.split(',')?.map((id: number) => Number(id)).includes(product.id) ||
              (product?.categories?.length && product?.categories?.map(category => category.id).includes(Number(action?.payload?.['category_ids'])))
          );
        
          ctx.patchState({
            ...state,
            relatedProducts: products,
            
          });
          
        },
        complete: () => {
          this.themeOptionService.preloader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetStoreProducts)
  getStoreProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
          const state = ctx.getState();
          const products = result.data.filter(product => 
          
            
            action?.payload?.['store_ids']?.split(',')?.map((id: number) => Number(id)).includes(product.store_id));
          ctx.patchState({
            ...state,
            storeProducts: products
          });
         
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetProductBySlug)
  getProductBySlug(ctx: StateContext<ProductStateModel>, { slug }: GetProductBySlug) {
    this.themeOptionService.preloader = true;
    return this.productService.getProducts().pipe(
      tap({
        next: results => {
          const result = results.data.find(product => product.slug == slug);
          if(result) {
            result.related_products = result.related_products && result.related_products.length ? result.related_products : [];
            result.cross_sell_products = result.cross_sell_products && result.cross_sell_products.length ? result.cross_sell_products : [];

            const ids = [...result.related_products, ...result.cross_sell_products];
            const categoryIds = [...result?.categories?.map(category => category.id)];
            this.store.dispatch(new GetRelatedProducts({ids: ids.join(','), category_ids: categoryIds.join(','), status: 1}));

            const state = ctx.getState();
            ctx.patchState({
              ...state,
              selectedProduct: result
            });
          } else {
            this.router.navigate(['/404']);
          }

        },
        complete: () => {
          this.themeOptionService.preloader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetDealProducts)
  getDealProducts(ctx: StateContext<ProductStateModel>, action: GetDealProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
        
          const state = ctx.getState();
          const products = result.data.filter(product => 
            action?.payload?.['ids']?.split(',')?.map((id: number) => Number(id)).includes(product.id));
          ctx.patchState({
            ...state,
            dealProducts: products.length ? products : result?.data?.reverse()?.slice(0, 2)
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }
}

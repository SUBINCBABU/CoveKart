import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import { GetProducts, CreateProduct, EditProduct, 
         UpdateProduct, UpdateProductStatus, ApproveProductStatus, DeleteProduct, 
         DeleteAllProduct, ReplicateProduct } from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { NotificationService } from "../services/notification.service";

export class ProductStateModel {
  product = {
    data: [] as Product[],
    total: 0
  }
  selectedProduct: Product | null;
  topSellingProducts: Product[]
}

@State<ProductStateModel>({
  name: "product",
  defaults: {
    product: {
      data: [],
      total: 0
    },
    selectedProduct: null,
    topSellingProducts: []
  },
})
@Injectable()
export class ProductState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private productService: ProductService) {}

  @Selector()
  static product(state: ProductStateModel) {
    return state.product;
  }

  @Selector()
  static products(state: ProductStateModel) {
    return state.product.data.filter(data => data.id !== state.selectedProduct?.id).map((res: Product) => { 
      return { label: res?.name, value: res?.id, data: { 
        type: res.type,
        name: res.name,
        slug: res.slug,
        stock_status: res.stock_status,
        image: res.product_thumbnail ? res.product_thumbnail.original_url : 'assets/images/product.png' 
      }}
    })
  }
 
  @Selector()
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static topSellingProducts(state: ProductStateModel) {
    return state.topSellingProducts;
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => { 
         
          if(action?.payload!['top_selling']) {
            const state = ctx.getState();
            ctx.patchState({
              ...state,
              topSellingProducts: result?.data?.slice(0,7)
            });
          } else {
            ctx.patchState({
              product: {
                data: result?.data,
                total: result?.total ? result?.total : result.data?.length
              }
            });
          }
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  // @Action(CreateProduct)
  // create(ctx: StateContext<ProductStateModel>, action: CreateProduct) {
  //   // Product Create Logic Here
  // }



  @Action(CreateProduct)
  create(ctx: StateContext<ProductStateModel>, action: CreateProduct) {
    return this.productService.createProduct(action.payload).pipe(
      tap({
        next: (createdProduct: Product) => {
          const state = ctx.getState();
          ctx.patchState({
            product: {
              ...state.product,
              data: [createdProduct, ...state.product.data],
              total: state.product.total + 1
            }
          });
  
          this.notificationService.showSuccess(
            "Product created successfully!"
           
          );
          this.store.dispatch(new UpdateBadgeValue("productCount", state.product.total + 1));
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || "Failed to create product."
          );
          throw new Error(error?.error?.message);
        }
      })
    );
  }
  



  // @Action(EditProduct)
  // edit(ctx: StateContext<ProductStateModel>, { id }: EditProduct) {
  //   const state = ctx.getState();
  //   const result = state.product.data.find(product => product.id == id);
  //   ctx.patchState({
  //     ...state,
  //     selectedProduct: result
  //   });
  // }




  @Action(EditProduct)
edit(ctx: StateContext<ProductStateModel>, { id }: EditProduct) {
  return this.productService.getProductById(id).pipe(
    tap({
      next: (product: Product) => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          selectedProduct: product,
        });
      },
      error: (error) => {
        this.notificationService.showError(
          error?.error?.message || 'Failed to fetch product details for editing.'
        );
        throw new Error(error?.error?.message);
      },
    })
  );
}


  // @Action(UpdateProduct)
  // update(ctx: StateContext<ProductStateModel>, { payload, id }: UpdateProduct) {
  //   // Product Update Logic Here
  // }



  @Action(UpdateProduct)
  updateProduct(ctx: StateContext<ProductStateModel>, action: UpdateProduct) {
    return this.productService.updateProduct(action.id, action.payload).pipe(
      tap((updatedProduct: Product) => {
        const state = ctx.getState();
        const data = state.product.data.map((product) =>
          product.id === action.id ? updatedProduct : product
        );
        ctx.patchState({
          product: { ...state.product, data },
        });
        this.notificationService.showSuccess("Product updated successfully!");
      })
    );
  }

  @Action(DeleteProduct)
  deleteProduct(ctx: StateContext<ProductStateModel>, action: DeleteProduct) {
    return this.productService.deleteProduct(action.id).pipe(
      tap(() => {
        const state = ctx.getState();
        const data = state.product.data.filter(
          (product) => product.id !== action.id
        );
        ctx.patchState({
          product: { ...state.product, data, total: state.product.total - 1 },
        });
        this.notificationService.showSuccess("Product deleted successfully!");
      })
    );
  
}



  // @Action(UpdateProductStatus)
  // updateStatus(ctx: StateContext<ProductStateModel>, { id, status }: UpdateProductStatus) {
  //   // Product Update Status Logic Here
  // }

  @Action(UpdateProductStatus)
  updateProductStatus(ctx: StateContext<ProductStateModel>, { id, status }: UpdateProductStatus) {
    return this.productService.updateProductStatus(id, status).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const updatedData = state.product.data.map((product) =>
            product.id === id ? { ...product, stock_status: status } : product
          );
          ctx.patchState({
            product: { ...state.product },
          });
  
          this.notificationService.showSuccess(
            `Product status updated successfully!`
          );
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || "Failed to update product status."
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }
  


  // @Action(ApproveProductStatus)
  // approveStatus(ctx: StateContext<ProductStateModel>, { id, status }: ApproveProductStatus) {
  //   // Product Approve Status Logic Here
  // }



  @Action(ApproveProductStatus)
  approveProductStatus(ctx: StateContext<ProductStateModel>, { id, status }: ApproveProductStatus) {
    return this.productService.approveProductStatus(id, status).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const updatedData = state.product.data.map((product) =>
            product.id === id ? { ...product, approved_status: status } : product
          );
  
          ctx.patchState({
            product: { ...state.product, data: updatedData },
          });
  
          this.notificationService.showSuccess(
            `Product approval status updated successfully!`
          );
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || "Failed to update product approval status."
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }
  


  // @Action(DeleteProduct)
  // delete(ctx: StateContext<ProductStateModel>, { id }: DeleteProduct) {
  //   // Product Delete Logic Here
  // }

  // @Action(DeleteAllProduct)
  // deleteAll(ctx: StateContext<ProductStateModel>, { ids }: DeleteAllProduct) {
  //   // Product Delete All Logic Here
  // }




  @Action(DeleteAllProduct)
  deleteAll(ctx: StateContext<ProductStateModel>, { ids }: DeleteAllProduct) {
    return this.productService.deleteAllProducts(ids).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const updatedData = state.product.data.filter(
            (product) => !ids.includes(product.id)
          );
          ctx.patchState({
            product: {
              ...state.product,
              data: updatedData,
              total: updatedData.length,
            },
          });
  
          this.notificationService.showSuccess(
            `${ids.length} products deleted successfully!`
          );
          this.store.dispatch(
            new UpdateBadgeValue("productCount", updatedData.length)
          );
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || "Failed to delete products."
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }
  




  @Action(ReplicateProduct)
  replicateProduct(ctx: StateContext<ProductStateModel>, { ids }: ReplicateProduct) {
    // Product Replicate Logic Here
  }

}

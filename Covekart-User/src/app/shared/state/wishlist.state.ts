import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { tap } from "rxjs";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Product } from "../interface/product.interface";
import { AddToWishlist, DeleteWishlist, GetWishlist } from "../action/wishlist.action";
import { WishlistService } from "../services/wishlist.service";

export class WishlistStateModel {
  wishlist = {
    data: [] as Product[],
    total: 0
  }
}

@State<WishlistStateModel>({
  name: "wishlist",
  defaults: {
    wishlist: {
      data: [],
      total: 0
    }
  },
})

@Injectable()
export class WishlistState {

  constructor(public router: Router,
    private wishlistService: WishlistService){}

  @Selector()
  static wishlistItems(state: WishlistStateModel) {
    return state.wishlist;
  }

  @Action(GetWishlist)
  getWishlistItems(ctx: StateContext<GetWishlist>) {
    this.wishlistService.skeletonLoader = true;
    return this.wishlistService.getWishlistItems().pipe(
      tap({
        next: result => {
          ctx.patchState({
            wishlist: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        complete: () => {
          this.wishlistService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  // @Action(AddToWishlist)
  // add(ctx: StateContext<WishlistStateModel>, action: AddToWishlist){
  //   // Add Wishlist Logic Here
  //   this.router.navigate(['/wishlist']);
  // }


  @Action(AddToWishlist)
  add(ctx: StateContext<WishlistStateModel>, action: AddToWishlist) {
    // Add Wishlist Logic Here
    // Set the loader to true to indicate processing
    this.wishlistService.skeletonLoader = true;

    // Post the new wishlist item to the backend
    return this.wishlistService.postWishlistItems(action.payload).pipe(
      tap({
        next: (result) => {
          // Get the current state
          const state = ctx.getState();

          // Update the state with the new item added to the wishlist
          ctx.patchState({
            wishlist: {
              data: result.data,
              total: state.wishlist.total + 1,
            },
          });

          // Optionally navigate to the wishlist page
          this.router.navigate(['/wishlist']);
        },
        complete: () => {
          // Turn off the loader
          this.wishlistService.skeletonLoader = false;
        },
        error: (err) => {
          throw new Error(err?.error?.message);
        },
      })
    );
  }



  // @Action(DeleteWishlist)
  // delete(ctx: StateContext<WishlistStateModel>, { id }: DeleteWishlist) {
  //   const state = ctx.getState();
  //   let item = state.wishlist.data.filter(value => value.id !== id);
  //   ctx.patchState({
  //     wishlist: {
  //       data: item,
  //       total: state.wishlist.total - 1
  //     }
  //   });
  // }


  @Action(DeleteWishlist)
  delete(ctx: StateContext<WishlistStateModel>, { id }: DeleteWishlist) {
    return this.wishlistService.deleteWishlistItems(id).pipe(
      tap(() => {
        const state = ctx.getState();
        const updatedData = state.wishlist.data.filter(item => item.id !== id);

        ctx.patchState({
          wishlist: {
            data: updatedData,
            total: state.wishlist.total - 1,
          },
        });
      }),
      // catchError((error) => {
      //   console.error('Error deleting wishlist item:', error);
      //   // Optionally handle the error (e.g., show an alert or revert state changes)
      //   throw error;
      // })
    );
  }


}

import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetCategories } from "../action/category.action";
import { Category } from "../../shared/interface/category.interface";
import { CategoryService } from "../services/category.service";

export class CategoryStateModel {
  category = {
    data: [] as Category[],
    total: 0
  }
}

@State<CategoryStateModel>({
  name: "category",
  defaults: {
    category: {
      data: [],
      total: 0
    }
  },
})
@Injectable()
export class CategoryState {
  
  constructor(private categoryService: CategoryService) {}

  @Selector()
  static category(state: CategoryStateModel) {
    return state.category;
  }

  // @Action(GetCategories)
  // getCategories(ctx: StateContext<CategoryStateModel>, action: any) {
  //   return this.categoryService.getCategories(action.payload).pipe(
  //     tap({
  //       next: result => { 
  //         ctx.patchState({
  //           category: {
  //             data: result.data,
  //             total: result?.total ? result?.total : result.data.length
  //           }
  //         });
  //       },
  //       error: err => { 
  //         throw new Error(err?.error?.message);
  //       }
  //     })
  //   );
  // }



  @Action(GetCategories)
  getCategories(ctx: StateContext<CategoryStateModel>, action: GetCategories) {
    return this.categoryService.getCategories(action.payload).pipe(
      tap({
        next: (result) => {
         
          
          ctx.patchState({
            category: {
              data: result.data,
              total: result.total || result.data.length,
            },
          });
        },
        error: (err) => {
          console.error("Failed to fetch categories:", err);
          throw err; 
        },
      })
    );
  }
  


}
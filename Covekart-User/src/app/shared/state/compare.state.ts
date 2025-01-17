import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { Product } from "../interface/product.interface";
import { AddToCompare, DeleteCompare, GetCompare } from "../action/compare.action";
import { CompareService } from "../services/compare.service";

export class CompareStateModel {
    items: Product[]
    total: number
}

@State<CompareStateModel>({
  name: "compare",
  defaults: {
    items: [],
    total: 0
  }
})

@Injectable()
export class CompareState {

  constructor(private store: Store, public router: Router,
    private compareService: CompareService){}

  @Selector()
  static compareItems(state: CompareStateModel) {
    return state.items;
  }

  @Selector()
  static compareTotal(state: CompareStateModel) {
    return state.total;
  }

  @Action(GetCompare)
  getCompareItems(ctx: StateContext<GetCompare>) {
    this.compareService.skeletonLoader = true;
    return this.compareService.getCompareItems().pipe(
      tap({
        next: result => {
          ctx.patchState({
            items: result.data,
            total: result?.total ? result?.total : result.data?.length
          });
        },
        complete: () => {
          this.compareService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(AddToCompare)
  add(ctx: StateContext<CompareStateModel>, action: AddToCompare){
    // Add Compare Logic
    this.router.navigate(['/compare'])
  }

  @Action(DeleteCompare)
  delete(ctx: StateContext<CompareStateModel>, { id }: DeleteCompare) {
    const state = ctx.getState();
    let item = state.items.filter(value => value.id !== id);
    ctx.patchState({
      items: item,
      total: state.total - 1
    });
  }
}

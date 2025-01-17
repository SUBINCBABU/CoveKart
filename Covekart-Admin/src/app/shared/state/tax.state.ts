import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetTaxes, CreateTax, EditTax, 
         UpdateTax, UpdateTaxStatus, DeleteTax, 
         DeleteAllTax } from "../action/tax.action";
import { Tax } from "../interface/tax.interface";
import { TaxService } from "../services/tax.service";
import { NotificationService } from "../services/notification.service";

export class TaxStateModel {
  tax = {
    data: [] as Tax[],
    total: 0
  }
  selectedTax: Tax | null;
}

@State<TaxStateModel>({
  name: "tax",
  defaults: {
    tax: {
      data: [],
      total: 0
    },
    selectedTax: null
  },
})
@Injectable()
export class TaxState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private taxService: TaxService) {}

  @Selector()
  static tax(state: TaxStateModel) {
    return state.tax;
  }

  @Selector()
  static taxes(state: TaxStateModel) {
    return state.tax.data.map((tax: Tax) => {
      return { label: tax?.name, value: tax?.id }
    });
  }

  @Selector()
  static selectedTax(state: TaxStateModel) {
    return state.selectedTax;
  }

  @Action(GetTaxes)
  getTaxes(ctx: StateContext<TaxStateModel>, action: GetTaxes) {
    return this.taxService.getTaxes(action.payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            tax: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  // @Action(CreateTax)
  // create(ctx: StateContext<TaxStateModel>, action: CreateTax) {
  //   // Tax Create Logic here
  // }


  @Action(CreateTax)
  create(ctx: StateContext<TaxStateModel>, action: CreateTax) {
    return this.taxService.createTax(action.payload).pipe(
      tap({
        next: (newTax: Tax) => {
          const state = ctx.getState();
          ctx.patchState({
            tax: {
              data: [...state.tax.data, newTax],
              total: state.tax.total + 1,
            },
          });
          this.notificationService.showSuccess("Tax created successfully");
        },
        error: (err) => {
          this.notificationService.showError("Failed to create tax");
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  



  @Action(EditTax)
  edit(ctx: StateContext<TaxStateModel>, { id }: EditTax) {
    const state = ctx.getState();
    const result = state.tax.data.find(tax => tax.id == id);
    ctx.patchState({
      ...state,
      selectedTax: result
    });
  }

  // @Action(UpdateTax)
  // update(ctx: StateContext<TaxStateModel>, { payload, id }: UpdateTax) {
  //   // Tax Update Logic here
  // }

  @Action(UpdateTax)
  update(ctx: StateContext<TaxStateModel>, action: UpdateTax) {
    return this.taxService.updateTax(action.id, action.payload).pipe(
      tap({
        next: (updatedTax: Tax) => {
          const state = ctx.getState();
          const updatedData = state.tax.data.map((tax) =>
            tax.id === action.id ? { ...updatedTax } : tax
          );
  
          ctx.patchState({
            tax: {
              ...state.tax,
              data: updatedData,
            },
          });
          this.notificationService.showSuccess("Tax updated successfully");
        },
        error: (err) => {
          this.notificationService.showError("Failed to update tax");
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  


  // @Action(UpdateTaxStatus)
  // updateStatus(ctx: StateContext<TaxStateModel>, { id, status }: UpdateTaxStatus) {
  //   // Tax Update Status Logic here
  // }



  @Action(UpdateTaxStatus)
updateStatus(ctx: StateContext<TaxStateModel>, action: UpdateTaxStatus) {
  return this.taxService.updateTaxStatus(action.id, action.status).pipe(
    tap({
      next: (updatedTax: Tax) => {
        const state = ctx.getState();
        const updatedData = state.tax.data.map((tax) =>
          tax.id === action.id ? { ...tax, status: action.status } : tax
        );

        ctx.patchState({
          tax: {
            ...state.tax,
            data: updatedData,
          },
        });
        this.notificationService.showSuccess(
          `Tax status updated to ${action.status ? "Active" : "Inactive"}`
        );
      },
      error: (err) => {
        this.notificationService.showError("Failed to update tax status");
        throw new Error(err?.error?.message);
      },
    })
  );
}


  // @Action(DeleteTax)
  // delete(ctx: StateContext<TaxStateModel>, { id }: DeleteTax) {
  //   // Tax Delete Logic here
  // }



  @Action(DeleteTax)
delete(ctx: StateContext<TaxStateModel>, action: DeleteTax) {
  return this.taxService.deleteTax(action.id).pipe(
    tap({
      next: () => {
        const state = ctx.getState();
        const updatedData = state.tax.data.filter((tax) => tax.id !== action.id);

        ctx.patchState({
          tax: {
            ...state.tax,
            data: updatedData,
            total: state.tax.total - 1,
          },
        });

        this.notificationService.showSuccess("Tax deleted successfully");
      },
      error: (err) => {
        this.notificationService.showError("Failed to delete tax");
        throw new Error(err?.error?.message);
      },
    })
  );
}


  // @Action(DeleteAllTax)
  // deleteAll(ctx: StateContext<TaxStateModel>, { ids }: DeleteAllTax) {
  //   // Tax Delete All Logic here
  // }


  @Action(DeleteAllTax)
deleteAll(ctx: StateContext<TaxStateModel>, action: DeleteAllTax) {
  return this.taxService.deleteAllTaxes(action.ids).pipe(
    tap({
      next: () => {
        const state = ctx.getState();
        const updatedData = state.tax.data.filter(
          (tax) => !action.ids.includes(tax.id)
        );

        ctx.patchState({
          tax: {
            ...state.tax,
            data: updatedData,
            total: state.tax.total - action.ids.length,
          },
        });

        this.notificationService.showSuccess("Selected taxes deleted successfully");
      },
      error: (err) => {
        this.notificationService.showError("Failed to delete selected taxes");
        throw new Error(err?.error?.message);
      },
    })
  );
}

  

}

import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {
  GetCurrencies, CreateCurrency, EditCurrency,
  UpdateCurrency, UpdateCurrencyStatus, DeleteCurrency,
  DeleteAllCurrency
} from "../action/currency.action";
import { Currency } from "../interface/currency.interface";
import { CurrencyService } from "../services/currency.service";
import { NotificationService } from "../services/notification.service";

export class CurrencyStateModel {
  currency = {
    data: [] as Currency[],
    total: 0
  }
  selectedCurrency: Currency | null;
}

@State<CurrencyStateModel>({
  name: "currency",
  defaults: {
    currency: {
      data: [],
      total: 0
    },
    selectedCurrency: null
  },
})
@Injectable()
export class CurrencyState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private currencyService: CurrencyService) { }

  @Selector()
  static currency(state: CurrencyStateModel) {
    return state.currency;
  }

  @Selector()
  static currencies(state: CurrencyStateModel) {
    return state.currency.data.map(res => {
      return { label: res?.code, value: res?.id }
    });
  }

  @Selector()
  static selectedCurrency(state: CurrencyStateModel) {
    return state.selectedCurrency;
  }

  @Action(GetCurrencies)
  getCurrencies(ctx: StateContext<CurrencyStateModel>, action: GetCurrencies) {
    return this.currencyService.getCurrencies(action.payload).pipe(
      tap({
        next: result => {

          ctx.patchState({
            currency: {
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

  // @Action(CreateCurrency)
  // create(ctx: StateContext<CurrencyStateModel>, action: CreateCurrency) {
  //   // Currency Create Logic Here
  // }


  @Action(CreateCurrency)
  create(ctx: StateContext<CurrencyStateModel>, action: CreateCurrency) {
    return this.currencyService.createCurrency(action.payload).pipe(
      tap({
        next: (result) => {
          // Update the state after successful currency creation
          const state = ctx.getState();
          ctx.patchState({
            currency: {
              data: [...state.currency.data, result],  // Add the new currency to the data array
              total: state.currency.total + 1,  // Increment total count
            },
          });

          // Notify user about the successful creation
          this.notificationService.showSuccess('Currency created successfully!');
        },
        error: (err) => {
          // Handle error and notify user
          this.notificationService.showError('Error creating currency');
          throw new Error(err?.error?.message);
        },
      })
    );
  }




  // @Action(EditCurrency)
  // edit(ctx: StateContext<CurrencyStateModel>, { id }: EditCurrency) {
  //   const state = ctx.getState();
  //   const result = state.currency.data.find(currency => currency.id == id);
  //   ctx.patchState({
  //     ...state,
  //     selectedCurrency: result
  //   });
  // }

  // @Action(UpdateCurrency)
  // update(ctx: StateContext<CurrencyStateModel>, { payload, id }: UpdateCurrency) {
  //   // Currency Updtae Logic Here
  // }





  @Action(EditCurrency)
  edit(ctx: StateContext<CurrencyStateModel>, { id }: EditCurrency) {
    return this.currencyService.edit(id).pipe(
      tap({
        next: (selectedCurrency) => {
          if (selectedCurrency) {
            ctx.patchState({
              selectedCurrency: selectedCurrency,
            });
          } else {
            console.warn(`EditShipping: No shipping found with ID ${id}`);
            ctx.patchState({
              selectedCurrency: null,
            });
          }
        },
        error: (err) => {
          console.error(`EditShipping: Error fetching shipping with ID ${id}`, err);
          ctx.patchState({
            selectedCurrency: null,
          });
          throw new Error(err?.error?.message || "Failed to fetch shipping details.");
        },
      })
    );
  }


  @Action(UpdateCurrency)
  update(ctx: StateContext<CurrencyStateModel>, { payload, id }: UpdateCurrency) {
    return this.currencyService.updateCurrency(payload, id).pipe(
      tap({
        next: (result) => {
          // Update the currency in the state
          const state = ctx.getState();
          const updatedData = state.currency.data.map(currency =>
            currency.id === id ? { ...currency, ...result } : currency
          );

          ctx.patchState({
            currency: {
              data: updatedData,  // Replace the old data with the updated one
              total: state.currency.total,  // Total count remains unchanged
            },
          });

          // Notify user about the successful update
          this.notificationService.showSuccess('Currency updated successfully!');
        },
        error: (err) => {
          // Handle error and notify user
          this.notificationService.showError('Error updating currency');
          throw new Error(err?.error?.message);
        },
      })
    );
  }






  // @Action(UpdateCurrencyStatus)
  // updateStatus(ctx: StateContext<CurrencyStateModel>, { id, status }: UpdateCurrencyStatus) {
  //   // Currency Update Status Logic Here
  // }



  @Action(UpdateCurrencyStatus)
updateStatus(ctx: StateContext<CurrencyStateModel>, { id, status }: UpdateCurrencyStatus) {

  return this.currencyService.updateCurrencyStatus(id, status).pipe(
    tap({
      next: (result) => {
       
        const state = ctx.getState();
        const updatedData = state.currency.data.map(currency =>
          currency.id === id ? { ...currency, status: result.status } : currency
        );

        ctx.patchState({
          currency: {
            data: updatedData,  
            total: state.currency.total,  
          },
        });
        window.location.reload()
        this.notificationService.showSuccess('Currency status updated successfully!');
      },
      error: (err) => {
       
        this.notificationService.showError('Error updating currency status');
        throw new Error(err?.error?.message);
      },
    })
  );
}


  // @Action(DeleteCurrency)
  // delete(ctx: StateContext<CurrencyStateModel>, { id }: DeleteCurrency) {
  //   // Currency Delete Logic Here
  // }

  @Action(DeleteCurrency)
  delete(ctx: StateContext<CurrencyStateModel>, { id }: DeleteCurrency) {
    // Call the service to delete the currency
    return this.currencyService.deleteCurrency(id).pipe(
      tap({
        next: () => {
          // Remove the currency from the state after the API call succeeds
          const state = ctx.getState();
          const updatedData = state.currency.data.filter(currency => currency.id !== id);
  
          ctx.patchState({
            currency: {
              data: updatedData,  // Update the data array by removing the deleted currency
              total: state.currency.total - 1,  // Decrease the total count
            },
          });
  
          // Notify the user about the successful deletion
          this.notificationService.showSuccess('Currency deleted successfully!');
        },
        error: (err) => {
          // Handle error and notify the user
          this.notificationService.showError('Error deleting currency');
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  



  // @Action(DeleteAllCurrency)
  // deleteAll(ctx: StateContext<CurrencyStateModel>, { ids }: DeleteAllCurrency) {
  //   // Currency Multiple Delete Logic Here
  // }



  @Action(DeleteAllCurrency)
deleteAll(ctx: StateContext<CurrencyStateModel>, { ids }: DeleteAllCurrency) {
  // Call the service to delete multiple currencies
  return this.currencyService.deleteAllCurrencies(ids).pipe(
    tap({
      next: () => {
        // Remove the deleted currencies from the state
        const state = ctx.getState();
        const updatedData = state.currency.data.filter(currency => !ids.includes(currency.id));

        ctx.patchState({
          currency: {
            data: updatedData,  // Update the data array by removing the deleted currencies
            total: state.currency.total - ids.length,  // Decrease the total count
          },
        });

        // Notify the user about the successful deletion
        this.notificationService.showSuccess('Selected currencies deleted successfully!');
      },
      error: (err) => {
        // Handle error and notify the user
        this.notificationService.showError('Error deleting currencies');
        throw new Error(err?.error?.message);
      },
    })
  );
}


}

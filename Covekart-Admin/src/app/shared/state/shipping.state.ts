import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetShippings, CreateShipping, EditShipping, 
         UpdateShipping, DeleteShipping, CreateShippingRule,
         UpdateShippingRule, DeleteShippingRule } from "../action/shipping.action";
import { Shipping, ShippingRule } from "../interface/shipping.interface";
import { ShippingService } from "../services/shipping.service";
import { NotificationService } from "../services/notification.service";

export class ShippingStateModel {
  shipping = {
    data: [] as Shipping[]
  }
  selectedShipping: Shipping | null;
}

@State<ShippingStateModel>({
  name: "shipping",
  defaults: {
    shipping: {
      data: []
    },
    selectedShipping: null
  },
})
@Injectable()
export class ShippingState {
  
  constructor(private notificationService: NotificationService,
    private shippingService: ShippingService) {}

  @Selector()
  static shipping(state: ShippingStateModel) {
    return state.shipping;
  }

  @Selector()
  static selectedShipping(state: ShippingStateModel) {
    return state.selectedShipping;
  }

  @Action(GetShippings)
  getShippings(ctx: StateContext<ShippingStateModel>) {
    return this.shippingService.getShippings().pipe(
      tap({
        next: result => {
         
          ctx.patchState({
            shipping: {
              data: result
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  // @Action(CreateShipping)
  // create(ctx: StateContext<ShippingStateModel>, action: CreateShipping) {
  //   // Shipping Create Logic Here
  // }


  @Action(CreateShipping)
  createShipping(ctx: StateContext<ShippingStateModel>, { payload }: CreateShipping) {
    return this.shippingService.createShipping(payload).pipe(
      tap({
        next: (newShipping: Shipping) => {
          // Get the current state
          const state = ctx.getState();
  
          // Update the shipping list with the new entry
          const updatedShippingList = [...state.shipping.data, newShipping];
  
          // Patch the state with the updated shipping data
          ctx.patchState({
            shipping: {
              ...state.shipping,
              data: updatedShippingList,
            },
          });
         window.location.reload()
          // Notify the user of the success
          this.notificationService.success("Shipping entry created successfully.");
        },
        error: (err) => {
          // Handle the error gracefully and notify the user
          const errorMessage = err?.error?.message || "An error occurred while creating the shipping entry.";
          this.notificationService.error(errorMessage);
  
          // Optionally, log the error for debugging
          console.error("Error in createShipping:", err);
  
          // Rethrow the error if necessary
          throw new Error(errorMessage);
        },
      })
    );
  }
  



  // @Action(EditShipping)
  // edit(ctx: StateContext<ShippingStateModel>, { id }: EditShipping) {
  //   const state = ctx.getState();
  //   const result = state.shipping.data.find(shipping => shipping.id == id);
  //   ctx.patchState({
  //     ...state,
  //     selectedShipping: result
  //   });
  // }



  @Action(EditShipping)
  edit(ctx: StateContext<ShippingStateModel>, { id }: EditShipping) {
    return this.shippingService.getShippingById(id).pipe(
      tap({
        next: (shipping) => {
          if (shipping) {
            ctx.patchState({
              selectedShipping: shipping,
            });
          } else {
            console.warn(`EditShipping: No shipping found with ID ${id}`);
            ctx.patchState({
              selectedShipping: null, // Clear selectedShipping if not found
            });
          }
        },
        error: (err) => {
          console.error(`EditShipping: Error fetching shipping with ID ${id}`, err);
          ctx.patchState({
            selectedShipping: null, // Clear selectedShipping in case of error
          });
          throw new Error(err?.error?.message || "Failed to fetch shipping details.");
        },
      })
    );
  }
  
  




  // @Action(UpdateShipping)
  // update(ctx: StateContext<ShippingStateModel>, { payload, id }: UpdateShipping) {
  //   // Shipping Update Logic Here
  // }



  @Action(UpdateShipping)
  updateShipping(ctx: StateContext<ShippingStateModel>, { payload, id }: UpdateShipping) {
    return this.shippingService.updateShipping(payload, id).pipe(
      tap({
        next: (updatedShipping: Shipping) => {
          const state = ctx.getState();
          const updatedShippingList = state.shipping.data.map(shipping =>
            shipping.id === id ? updatedShipping : shipping
          );
  
          ctx.patchState({
            shipping: {
              data: updatedShippingList,
            },
          });
  
          this.notificationService.success("Shipping entry updated successfully.");
        },
        error: (err) => {
          this.notificationService.error("Failed to update shipping entry.");
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  


  // @Action(DeleteShipping)
  // delete(ctx: StateContext<ShippingStateModel>, { id }: DeleteShipping) {
  //   // Shipping Delete Logic Here
  // }



  @Action(DeleteShipping)
  deleteShipping(ctx: StateContext<ShippingStateModel>, { id }: DeleteShipping) {
    return this.shippingService.deleteShipping(id).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const updatedShippingList = state.shipping.data.filter(shipping => shipping.id !== id);
  
          ctx.patchState({
            shipping: {
              data: updatedShippingList,
            },
          });
     window.location.reload()
          this.notificationService.success("Shipping entry deleted successfully.");
        },
        error: (err) => {
          this.notificationService.error("Failed to delete shipping entry.");
          throw new Error(err?.error?.message);
        },
      })
    );
  }



  // @Action(CreateShippingRule)
  // createRule(ctx: StateContext<ShippingStateModel>, action: CreateShippingRule) {
  //   // Shipping Create Rule Logic Here
  // }


  @Action(CreateShippingRule)
  createShippingRule(ctx: StateContext<ShippingStateModel>, { payload }: CreateShippingRule) {
    return this.shippingService.createShippingRule(payload).pipe(
      tap({
        next: (newRule: ShippingRule) => {
          const state = ctx.getState();
  
          // Find the shipping object to update its rules
          const updatedShippingList = state.shipping.data.map(shipping => {
            if (shipping.id === newRule.shipping_id) {
              return {
                ...shipping,
                shipping_rules: [...shipping.shipping_rules, newRule],
              };
            }
            return shipping;
          });
  
          ctx.patchState({
            shipping: {
              data: updatedShippingList,
            },
          });
          window.location.reload()
          this.notificationService.success("Shipping rule created successfully.");
        },
        error: (err) => {
          this.notificationService.error("Failed to create shipping rule.");
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  

  

  // @Action(UpdateShippingRule)
  // updateRule(ctx: StateContext<ShippingStateModel>, { payload, id }: UpdateShippingRule) {
  //   // Shipping Update Rule Logic Here
  // }


  @Action(UpdateShippingRule)
  updateShippingRule(ctx: StateContext<ShippingStateModel>, { id, payload }: UpdateShippingRule) {
    return this.shippingService.updateShippingRule(id, payload).pipe(
      tap({
        next: (updatedRule: ShippingRule) => {
          const state = ctx.getState();
  
          // Update the relevant rule in the appropriate shipping entry
          const updatedShippingList = state.shipping.data.map(shipping => {
            if (shipping.id === updatedRule.shipping_id) {
              const updatedRules = shipping.shipping_rules.map(rule =>
                rule.id === id ? updatedRule : rule
              );
  
              return {
                ...shipping,
                shipping_rules: updatedRules,
              };
            }
            return shipping;
          });
  
          ctx.patchState({
            shipping: {
              data: updatedShippingList,
            },
          });
          window.location.reload()
          this.notificationService.success("Shipping rule updated successfully.");
        },
        error: (err) => {
          this.notificationService.error("Failed to update shipping rule.");
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  

  // @Action(DeleteShippingRule)
  // deleteRule(ctx: StateContext<ShippingStateModel>, { id }: DeleteShippingRule) {
  //   // Shipping Delete Rule Logic Here
  // }


  @Action(DeleteShippingRule)
deleteRule(ctx: StateContext<ShippingStateModel>, { id }: DeleteShippingRule) {
  return this.shippingService.deleteShippingRule(id).pipe(
    tap({
      next: () => {
        const state = ctx.getState();
        const updatedShipping = state.shipping.data.map((shipping) => ({
          ...shipping,
          shipping_rules: shipping.shipping_rules.filter((rule) => rule.id !== id),
        }));

        ctx.patchState({
          shipping: {
            ...state.shipping,
            data: updatedShipping,
          },
        });
        window.location.reload()
        this.notificationService.success("Shipping rule deleted successfully.");
      },
      error: (err) => {
        console.error(`DeleteShippingRule: Error deleting shipping rule with ID ${id}`, err);
        this.notificationService.error("Failed to delete the shipping rule.");
        throw new Error(err?.error?.message || "Failed to delete the shipping rule.");
      },
    })
  );
}



}

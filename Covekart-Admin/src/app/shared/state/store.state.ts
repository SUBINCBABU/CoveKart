import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import { GetStores, CreateStore, EditStore, UpdateStore, UpdateStoreStatus, DeleteStore, 
         DeleteAllStore, ApproveStoreStatus} from "../action/store.action";
import { Stores } from "../interface/store.interface";
import { StoreService } from "../services/store.service";
import { NotificationService } from "../services/notification.service";

export class StoreStateModel {
  store = {
    data: [] as Stores[],
    total: 0
  }
  selectedStore: Stores | null;
}

@State<StoreStateModel>({
  name: "store",
  defaults: {
    store: {
      data: [],
      total: 0
    },
    selectedStore: null
  },
})
@Injectable()
export class StoreState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private storeService: StoreService) {}

  @Selector()
  static store(state: StoreStateModel) {
    return state.store;
  }

  @Selector()
  static stores(state: StoreStateModel) {
    return state.store.data.map(store => {
      return { label: store?.store_name, value: store?.id }
    });
  }

  @Selector()
  static selectedStore(state: StoreStateModel) {
    return state.selectedStore;
  }

 
  @Action(GetStores)
  getStores(ctx: StateContext<StoreStateModel>, action: GetStores) {
    return this.storeService.getStores(action.payload).pipe(
      tap({
        next: (result) => {
          ctx.patchState({
            store: {
              data: result.data,
              total: result.total || result.data.length,
            },
          });
          this.notificationService.showSuccess("Stores retrieved successfully!");
        },
        error: (err) => {
          this.notificationService.showError("Failed to retrieve stores.");
          throw new Error(err.message);
        },
      })
    );
  }



  
  @Action(CreateStore)
  createStore(ctx: StateContext<StoreStateModel>, action: CreateStore) {
    return this.storeService.createStore(action.payload).pipe(
      tap({
        next: (newStore) => {
          const state = ctx.getState();
          ctx.patchState({
            store: {
              ...state.store,
              data: [...state.store.data, newStore],
              total: state.store.total + 1,
            },
          });
          this.notificationService.showSuccess("Store created successfully!");
        },
        error: (err) => {
          this.notificationService.showError("Failed to create store.");
          throw new Error(err.message);
        },
      })
    );
  }

  @Action(EditStore)
  editStore(ctx: StateContext<StoreStateModel>, { id }: EditStore) {
    return this.storeService.getStoreById(id).pipe(
      tap({
        next: (store) => {
          ctx.patchState({
            selectedStore: store,
          });
          this.notificationService.showSuccess("Store details loaded successfully!");
        },
        error: (err) => {
          this.notificationService.showError("Failed to load store details.");
          throw new Error(err.message);
        },
      })
    );
  }
  



  @Action(UpdateStore)
  updateStore(ctx: StateContext<StoreStateModel>, { payload, id }: UpdateStore) {
   
    const state = ctx.getState();
    
        
    const updatedStores = state.store.data.map((store) => {
      if (store.id === id) {
      
        return { ...store, ...payload }; 
      }
      return store;
    });
  
    ctx.patchState({
      store: {
        data: updatedStores,
        total: state.store.total,
      },
    });
  
    
    return this.storeService.updateStore(payload, id).pipe(
      tap({
        next: (result) => {
          this.notificationService.showSuccess('Store updated successfully.');
        },
        error: (err) => {
          
          ctx.patchState({
            store: {
              data: state.store.data, 
              total: state.store.total,
            },
          });
          this.notificationService.showError('Failed to update store.');
          throw new Error(err?.message || 'Unknown error');
        },
      })
    );
  }
  


  @Action(UpdateStoreStatus)
  updateStatus(ctx: StateContext<StoreStateModel>, { id, status }: UpdateStoreStatus) {
    const state = ctx.getState();
  
    return this.storeService.updateStoreStatus(id, status).pipe(
      tap({
        next: (updatedStore: Stores) => {
          
          const updatedData = state.store.data.map(store =>
            store.id === id ? { ...store, status: updatedStore.status } : store
          );
  
          ctx.patchState({
            store: {
              ...state.store,
              data: updatedData,
            },
          });
        
          window.location.reload();
  
          
          this.notificationService.showSuccess(
            `Store status updated to ${status ? 'Active' : 'Inactive'} successfully.`
          );
        },
        error: (err) => {
          window.location.reload();
          this.notificationService.showError('Failed to update store status.');
          throw new Error(err?.error?.message || 'Failed to update store status');
        },
      })
    );
  }
  



  // @Action(ApproveStoreStatus)
  // approveStatus(ctx: StateContext<StoreStateModel>, { id, status }: ApproveStoreStatus) {
  //   // Store Approve Status Logic Here
  // }



  @Action(ApproveStoreStatus)
  approveStatus(ctx: StateContext<StoreStateModel>, { id, status }: ApproveStoreStatus) {
    const state = ctx.getState();
  
    return this.storeService.approveStoreStatus(id, status).pipe(
      tap({
        next: (updatedStore: Stores) => {
          // Update the store's approval status in the state
          const updatedData = state.store.data.map(store =>
            store.id === id ? { ...store, is_approved: updatedStore.is_approved } : store
          );
  
          ctx.patchState({
            store: {
              ...state.store,
              data: updatedData,
            },
          });
          window.location.reload()
          // Notify the user of successful approval status update
          this.notificationService.showSuccess(
            `Store approval status updated to ${status ? 'Approved' : 'Disapproved'} successfully.`
          );
        },
        error: (err) => {
          // Notify the user of an error
          this.notificationService.showError('Failed to update store approval status.');
          throw new Error(err?.error?.message || 'Failed to update store approval status');
        },
      })
    );
  }
  



  // @Action(DeleteStore)
  // delete(ctx: StateContext<StoreStateModel>, { id }: DeleteStore) {
  //   // Store Delete Logic Here
  // }

  @Action(DeleteStore)
deleteStore(ctx: StateContext<StoreStateModel>, { id }: DeleteStore) {
  const state = ctx.getState();

  return this.storeService.deleteStore(id).pipe(
    tap({
      next: () => {
   
        const updatedData = state.store.data.filter(store => store.id !== id);

        ctx.patchState({
          store: {
            ...state.store,
            data: updatedData,
            total: state.store.total - 1,
          },
        });

        this.notificationService.showSuccess('Store deleted successfully.');
      },
      error: (err) => {
        
        this.notificationService.showError('Failed to delete store.');
        throw new Error(err?.error?.message || 'Failed to delete store');
      },
    })
  );
}


  // @Action(DeleteAllStore)
  // deleteAll(ctx: StateContext<StoreStateModel>, { ids }: DeleteAllStore) {
  //   // Store Delete All Logic Here
  // }


  @Action(DeleteAllStore)
deleteAllStores(ctx: StateContext<StoreStateModel>, { ids }: DeleteAllStore) {
  const state = ctx.getState();

  return this.storeService.deleteAllStores(ids).pipe(
    tap({
      next: () => {
        
        const updatedData = state.store.data.filter(store => !ids.includes(store.id));

        ctx.patchState({
          store: {
            ...state.store,
            data: updatedData,
            total: state.store.total - ids.length, 
          },
        });

     
        this.notificationService.showSuccess('Selected stores deleted successfully.');
      },
      error: (err) => {
        this.notificationService.showError('Failed to delete selected stores.');
        throw new Error(err?.error?.message || 'Failed to delete selected stores');
      },
    })
  );
}


}

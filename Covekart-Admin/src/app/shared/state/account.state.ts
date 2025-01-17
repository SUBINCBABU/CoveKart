import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetUserDetails, UpdateUserProfile, UpdateUserPassword, AccountClear, updateStoreDetails } from "../action/account.action";
import { AccountUser } from "./../interface/account.interface";
import { AccountService } from "../services/account.service";
import { NotificationService } from "../services/notification.service";
import { Permission } from "../interface/role.interface";

export class AccountStateModel {
  user: AccountUser | null |any;
  permissions: Permission[];
  roleName: string | null;
}

@State<AccountStateModel>({
  name: "account",
  defaults: {
    user: null,
    permissions: [],
    roleName: null
  },
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService,
      private notificationService: NotificationService, 
      public router: Router) {}

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static permissions(state: AccountStateModel) {
    return state.permissions;
  }

  @Selector()
  static getRoleName(state: AccountStateModel) {
    return state.roleName;
  }

 

  @Action(GetUserDetails)
  getUserDetails(ctx: StateContext<AccountStateModel>) {
    return this.accountService.getUserDetails().pipe(
      tap({
        next: result => { 
          ctx.patchState({
            user: result,
            permissions: result.permission,
            roleName: result.role.name
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }




  // @Action(UpdateUserProfile)
  // updateProfile(ctx: StateContext<AccountStateModel>, { payload }: UpdateUserProfile) {
  //   // Update Profile Logic Here
  // }

  @Action(UpdateUserProfile)
  updateUserProfile(
    ctx: StateContext<AccountStateModel>,
    { payload }: UpdateUserProfile
  ) {
    return this.accountService.updateUserProfile(payload).pipe(
      tap({
        next: (updatedUser) => {
        
          ctx.patchState({ user: updatedUser });
          window.location.reload()
          this.notificationService.showSuccess("Profile updated successfully.");
        },
        error: (err) => {
          this.notificationService.showError(
            err?.error?.message || "Failed to update profile."
          );
          throw new Error(err);
        },
      })
    );
  }
  


  // @Action(UpdateUserPassword)
  // updatePassword(ctx: StateContext<AccountStateModel>, { payload }: UpdateUserPassword) {
  //   // Update Password Logic Here
  // }



  @Action(UpdateUserPassword)
  updatePassword(
    ctx: StateContext<AccountStateModel>,
    { payload }: UpdateUserPassword
  ) {
    return this.accountService.updateUserPassword(payload).pipe(
      tap({
        next: () => {
          
          this.notificationService.showSuccess("Password updated successfully.");
        },
        error: (err) => {
          
          this.notificationService.showError(
            err?.error?.message || "Failed to update password."
          );
          throw new Error(err);
        },
      })
    );
  }

  




  // @Action(updateStoreDetails)
  // updateStoreDetails(ctx: StateContext<AccountStateModel>, { payload }: updateStoreDetails) {
  //   // Update Store Logic Here
  // }




  @Action(updateStoreDetails)
  updateStoreDetails(ctx: StateContext<AccountStateModel>, { payload }: updateStoreDetails) {
    return this.accountService.updateStoreDetails(payload).pipe(
      tap({
        next: (updatedStore) => {
          // Notify success
          this.notificationService.showSuccess("Store details updated successfully!");
  
          // Update the user's store information in the state
          const currentUser = ctx.getState().user;
          if (currentUser) {
            ctx.patchState({
              user: {
                ...currentUser,
                store: updatedStore,
              },
            });
          }
        },
        error: (error) => {
          // Notify error and log it
          this.notificationService.showError("Failed to update store details");
          console.error("Error updating store details:", error);
        },
      })
    );
  }
  


  // @Action(AccountClear)
  // accountClear(ctx: StateContext<AccountStateModel>){
  //   ctx.patchState({
  //     user: null,
  //     permissions: [],
  //     roleName: null
  //   });
  // }



  @Action(AccountClear)
accountClear(ctx: StateContext<AccountStateModel>) {
  ctx.patchState({
    user: null,
    permissions: [],
    roleName: null,
  });
}


}
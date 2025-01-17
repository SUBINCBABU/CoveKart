import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap } from "rxjs";
import { GetUserDetails, UpdateUserProfile, UpdateUserPassword,CreateAddress, UpdateAddress, DeleteAddress, AccountClear } from "../action/account.action";
import { AccountUser, AccountUserUpdatePassword } from "./../interface/account.interface";
import { AccountService } from "../services/account.service";
import { NotificationService } from "../services/notification.service";
import { Permission } from "../interface/role.interface";
import { UserAddress } from "../interface/user.interface";
import { Router } from "@angular/router";

export class AccountStateModel {
  id:Number | null;
  user: AccountUser | null;
  permissions: Permission[];
  useraddress:UserAddress |null
}

@State<AccountStateModel>({
  
    name: "account",
    defaults: {
      id: null,
      user: null,
      permissions: [],
      useraddress:null
    },
})
@Injectable()
export class AccountState {
  notificationService: any;

  constructor(private accountService: AccountService ,  private router:Router) {}

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static permissions(state: AccountStateModel) {
    return state.permissions;
  }


  
  

  @Action(GetUserDetails)
  getUserDetails(ctx: StateContext<AccountStateModel>) {
    return this.accountService.getUserDetails().pipe(
      tap({
        next: result => { 
        
          ctx.patchState({
            user: result,
            permissions: result.permission,
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
  updateUserProfile(ctx: StateContext<AccountStateModel>, { payload }: UpdateUserProfile) {
    return this.accountService.updateUserProfileService(payload).pipe(
      tap((updatedUser: AccountUser) => {
       
        const currentState = ctx.getState();
  
        ctx.patchState({
          user: {
            ...currentState.user,
            ...updatedUser, 
          } as AccountUser,
        });
      }),
      catchError((error) => {
        console.error("Error updating user profile:", error);
        throw error;
      })
    );
  }
  


  @Action(UpdateUserPassword)
  updatePassword(ctx: StateContext<AccountUserUpdatePassword>, { payload }: UpdateUserPassword) {
    // Update Password Logic Here
  }

  // @Action(CreateAddress)
  //     createAddress(ctx: StateContext<AccountStateModel>,{ payload }: CreateAddress) {
  //     return this.accountService.postUserAddressServivice(payload).pipe(
  //       tap((result: UserAddress) => { 
          
  //           ctx.patchState({
  //            id:result.user_id
  //           });
            
  //       })
  //   );

  //   // Create Address Logic Here
  // }



  @Action(CreateAddress)
  createAddress(ctx: StateContext<AccountStateModel>, { payload }: CreateAddress) {
    return this.accountService.postUserAddressServivice(payload).pipe(
      tap((result: UserAddress) => {
        console.log("create user result",result);
        
        const currentState = ctx.getState();
  
        if (currentState.user) {
          const updatedAddresses = currentState.user.address
            ? [...currentState.user.address, result]
            : [result];
  
          ctx.patchState({
            user: {
              ...currentState.user,
              address: updatedAddresses,
            } as AccountUser,
          });
        }
      }),
      catchError((error) => {
        console.error("Error creating address:", error);
        throw error;
      })
    );
  }
  




  // @Action(UpdateAddress)
  // updateAddress(ctx: StateContext<AccountStateModel>, action: UpdateAddress) {
  //   // Update Address Logic Here
  // }




  @Action(UpdateAddress)
  updateAddress(ctx: StateContext<AccountStateModel>, { payload, id }: UpdateAddress) {
    return this.accountService.updateUserAddressService(payload, id).pipe(
      tap((updatedAddress: UserAddress) => {
        const currentState = ctx.getState();
  
        // Ensure `user` exists before trying to modify it
        if (currentState.user && currentState.user.address) {
          const updatedUserAddresses = currentState.user.address.map(address =>
            address.id === id ? updatedAddress : address
          );
  
          ctx.patchState({
            user: {
              ...currentState.user,
              address: updatedUserAddresses,
            } as AccountUser, // Ensure type compatibility
            
          });
         
        }
      })
    );  
  }
  





  // @Action(DeleteAddress)
  // deleteAddress(ctx: StateContext<AccountStateModel>, action: DeleteAddress) {
  //   // Delete Address Logic Here
  // }




//   @Action(DeleteAddress)
// deleteAddress(ctx: StateContext<AccountStateModel>, { id }: DeleteAddress) {
//   return this.accountService.deleteAddress(id).pipe(
//     tap(() => {
//       const currentState = ctx.getState();

      
//       if (currentState.user && currentState.user.address) {
//         const updatedAddresses = currentState.user.address.filter(
//           address => address.id !== id
//         );   

//         ctx.patchState({
//           user: {
//             ...currentState.user,
//             address: updatedAddresses,
//           } as AccountUser, 
//         });
       
//       }
//     })
//   );
// }


@Action(DeleteAddress)
deleteAddress(ctx: StateContext<AccountStateModel>, { id }: DeleteAddress) {
  return this.accountService.deleteAddress(id).pipe(
    tap(() => {
      const currentState = ctx.getState();

      
      if (currentState.user && currentState.user.address) {
        const updatedAddresses = currentState.user.address.filter(
          address => address.id !== id
        );
         ctx.patchState({
          user: {
            ...currentState.user,
            address: updatedAddresses,
          } as AccountUser, 
        });
      }
    }),
    catchError((error) => {
      console.error("Error deleting address:", error);
      throw error; // Re-throw the error for higher-level handling
    })
  );
}




  @Action(AccountClear)
  accountClear(ctx: StateContext<AccountStateModel>){
    ctx.patchState({
      user: null,
      permissions: []
    });
  }

}
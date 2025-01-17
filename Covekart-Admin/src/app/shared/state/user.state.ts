import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap, throwError } from "rxjs";
import {
  GetUsers, CreateUser, EditUser, UpdateUser,
  UpdateUserStatus, DeleteUser, DeleteAllUser,
  CreateUserAddress, ImportUser, ExportUser
} from "../action/user.action";
import { User, UserModel } from "../interface/user.interface";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";

export class UserStateModel {
  user = {
    data: [] as User[],
    total: 0
  }
  selectedUser: User | null;
}

@State<UserStateModel>({
  name: "user",
  defaults: {
    user: {
      data: [],
      total: 0
    },
    selectedUser: null
  },
})
@Injectable()
export class UserState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private userService: UserService) { }

  @Selector()
  static user(state: UserStateModel) {
    return state.user;
  }

  @Selector()
  static users(state: UserStateModel) {
    return state.user.data.map(user => {
      return { label: user?.name, value: user?.id }
    });
  }

  @Selector()
  static selectedUser(state: UserStateModel) {
    return state.selectedUser;
  }

  // @Action(GetUsers)
  // getUsers(ctx: StateContext<UserStateModel>, action: GetUsers) {
  //   return this.userService.getUsers(action?.payload).pipe(
  //     tap({
  //       next: result => {
  //         ctx.patchState({
  //           user: {
  //             data: result.data,
  //             total: result?.total ? result?.total : result.data?.length
  //           }
  //         });
  //       },
  //       error: err => { 
  //         throw new Error(err?.error?.message);
  //       }
  //     })
  //   );
  // }



  @Action(GetUsers)
  getUsers(ctx: StateContext<UserStateModel>, action: GetUsers) {
    return this.userService.getUsers(action.payload).pipe(
      tap({
        next: (result: UserModel) => {
          ctx.patchState({
            user: {
              data: result.data,
              total: result?.total ?? result.data.length
            },

          });
          this.notificationService.showSuccess('Users fetched successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to fetch users.');
          throw new Error(err?.message);
        },
      })
    );
  }



  // @Action(CreateUser)
  // create(ctx: StateContext<UserStateModel>, action: CreateUser) {
  //   // User Create Logic Here
  // }




  //   @Action(CreateUser)
  // createUser(ctx: StateContext<UserStateModel>, { payload }: CreateUser) {
  //   return this.userService.createUser(payload).pipe(
  //     tap((newUser: User) => {
  //       const state = ctx.getState();
  //       ctx.patchState({
  //         user: {
  //           ...state.user,
  //           data: [...state.user.data, newUser],
  //           total: state.user.total + 1,
  //         },
  //       });
  //     }),
  //     catchError((error) => {

  //       this.notificationService.error('Failed to create user');

  //       throw error;
  //     })
  //   );
  // }


  @Action(CreateUser)
  createUser(ctx: StateContext<UserStateModel>, { payload }: CreateUser) {
    return this.userService.createUser(payload).pipe(
      tap((newUser: User) => {
        // Update state with new user data
        const state = ctx.getState();
        ctx.patchState({
          user: {
            ...state.user,
            data: [...state.user.data, newUser],
            total: state.user.total + 1,
          },
        });

        // Show success notification
        this.notificationService.showSuccess('User created successfully');
      }),
      catchError((error) => {
        // Log error and notify user of the failure
        console.error('Error creating user:', error);
        this.notificationService.showError('failed to create');

        // Ensure the error propagates
        return throwError(() => new Error('Failed to create user.'));
      })
    );
  }





  @Action(EditUser)
  edit(ctx: StateContext<UserStateModel>, { id }: EditUser) {
    const state = ctx.getState();
    const result = state.user.data.find(user => user.id == id);
    ctx.patchState({
      ...state,
      selectedUser: result
    });
  }

  // @Action(UpdateUser)
  // update(ctx: StateContext<UserStateModel>, { payload, id }: UpdateUser) {
  //   // User Update Logic Here
  // }



  @Action(UpdateUser)
  update(ctx: StateContext<UserStateModel>, { payload, id }: UpdateUser) {
    return this.userService.updateUser(id, payload).pipe(
      tap((updatedUser: User) => {
        // Update the state with the new user data
        const state = ctx.getState();
        const updatedUserData = state.user.data.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );

        ctx.patchState({
          user: {
            ...state.user,
            data: updatedUserData,
          },
        });

        // Show success notification
        this.notificationService.showSuccess('User updated successfully');
      }),
      catchError((error) => {
        // Log the error and show the error notification
        console.error('Error updating user:', error);
        this.notificationService.showError('Failed to update user.');

        // Propagate the error to other parts of the app if necessary
        return throwError(() => new Error('Failed to update user.'));
      })
    );
  }




  // @Action(UpdateUserStatus)
  // updateStatus(ctx: StateContext<UserStateModel>, { id, status }: UpdateUserStatus) {
  //   // User Update Status Logic Here
  // }


  @Action(UpdateUserStatus)
  updateStatus(ctx: StateContext<UserStateModel>, { id, status }: UpdateUserStatus) {
    const state = ctx.getState();

    // Call the service to update the user status
    return this.userService.updateUserStatus(id, status).pipe(
      tap({
        next: (updatedUser: User) => {
          // Update the user's status in the state
          const updatedData = state.user.data.map(user =>
            user.id === id ? { ...user, status: updatedUser.status } : user
          );

          ctx.patchState({
            user: {
              ...state.user,
              data: updatedData,
            },
          });
          window.location.reload();

          this.notificationService.showSuccess(
            `User status updated to ${status ? 'Active' : 'Inactive'} successfully.`
          );
        },
        error: (err) => {
          // Notify the user of an error
          this.notificationService.showError('Failed to update user status.');
          throw new Error(err?.error?.message || 'Failed to update user status');
        },
      })
    );
  }



  // @Action(DeleteUser)
  // delete(ctx: StateContext<UserStateModel>, { id }: DeleteUser) {
  //   // User Delete Logic Here
  // }


  @Action(DeleteUser)
  delete(ctx: StateContext<UserStateModel>, { id }: DeleteUser) {
    return this.userService.deleteUser(id).pipe(
      tap(() => {
        // Update the state to remove the deleted user
        const state = ctx.getState();
        const updatedUsers = state.user.data.filter(user => user.id !== id);

        ctx.patchState({
          user: {
            ...state.user,
            data: updatedUsers,
            total: state.user.total - 1, // Decrease the total user count
          },
        });

        // Show success notification
        this.notificationService.showSuccess('User deleted successfully');
      }),
      catchError((error) => {
        // Log the error and show the error notification
        console.error('Error deleting user:', error);
        this.notificationService.showError(error?.message || 'Failed to delete user.');

        // Propagate the error to other parts of the app if necessary
        return throwError(() => new Error('Failed to delete user.'));
      })
    );
  }


  // @Action(DeleteAllUser)
  // deleteAll(ctx: StateContext<UserStateModel>, { ids }: DeleteAllUser) {
  //   // User Delete All Logic Here
  // }




  @Action(DeleteAllUser)
  deleteAll(ctx: StateContext<UserStateModel>, { ids }: DeleteAllUser) {
    return this.userService.deleteAllUsers(ids).pipe(
      tap(() => {
        // Success handling after all users are deleted
        const state = ctx.getState();
        // Update the state by removing the deleted users
        ctx.patchState({
          user: {
            ...state.user,
            data: state.user.data.filter((user) => !ids.includes(user.id)),
            total: state.user.total - ids.length, // Adjust total count
          },
        });

        this.notificationService.showSuccess(
          `${ids.length} users have been deleted successfully.`
        );
      }),
      catchError((error) => {
        // Error handling
        this.notificationService.showError('Failed to delete users.');
        throw error;
      })
    );
  }


  @Action(ImportUser)
  import(ctx: StateContext<UserStateModel>, action: ImportUser) {
    // User Import Logic Here
  }

  @Action(ExportUser)
  export(ctx: StateContext<UserStateModel>, action: ExportUser) {
    // User Export Logic Here
  }

  @Action(CreateUserAddress)
  createUserAddress(ctx: StateContext<UserStateModel>, action: CreateUserAddress) {
    // User Create Address Logic Here
  }

}

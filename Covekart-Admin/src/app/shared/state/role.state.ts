import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap, throwError } from "rxjs";
import {
  GetRoles, GetRoleModules, CreateRole, EditRole,
  UpdateRole, DeleteRole, DeleteAllRole
} from "../action/role.action";
import { Role, Module, RoleModel } from "../interface/role.interface";
import { RoleService } from "../services/role.service";
import { NotificationService } from "../services/notification.service";
import { log } from "node:console";

export class RoleStateModel {
  role = {
    data: [] as Role[],
    total: 0
  }
  selectedRole: Role | null;
  modules: Module[];
}

@State<RoleStateModel>({
  name: "role",
  defaults: {
    role: {

      data: [],
      total: 0
    },
    selectedRole: null,
    modules: []
  },
})
@Injectable()
export class RoleState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private roleService: RoleService) { }

  @Selector()
  static role(state: RoleStateModel) {
    return state.role;
  }

  @Selector()
  static roles(state: RoleStateModel) {
    return state.role.data.map(res => {
      return { label: res?.name, value: res?.id }
    }).filter(value => value.label !== 'admin' && value.label !== 'vendor');
  }

  @Selector()
  static selectedRole(state: RoleStateModel) {
    return state.selectedRole;
  }

  @Selector()
  static roleModules(state: RoleStateModel) {
    return state.modules;
  }




  @Action(GetRoles)
  getRoles(ctx: StateContext<RoleStateModel>, action: GetRoles) {
    return this.roleService.getRoles(action.payload).pipe(
      tap({
        next: (result: RoleModel) => {
       
          ctx.patchState({
            role: {
              data: result.data,
              total: result.total || result.data.length,


            },
          });
        },
        error: (error) => {
          console.error("Error fetching roles:", error);
          throw new Error("Failed to fetch roles. Please try again later.");
        },
      })
    );
  }



  @Action(GetRoleModules)
  getRoleModules(ctx: StateContext<RoleStateModel>) {
    return this.roleService.getRoleModules().pipe(
      tap({
        next: (modules) => {
          ctx.patchState({
            modules: modules,
          });
         
        },
        error: (error) => {
          console.error("Error updating role modules in state:", error.message);
        },
      })
    );
  }



  @Action(CreateRole)
  create(ctx: StateContext<RoleStateModel>, action: CreateRole) {
    const state = ctx.getState();

    return this.roleService.createRole(action.payload).pipe(
      tap({
        next: (result: Role) => {
          ctx.patchState({
            role: {
              data: [...state.role.data, result],
              total: state.role.total + 1,
            },
          });
          this.notificationService.showSuccess('Role created successfully.');
        },
        error: (err) => {
        
          this.notificationService.showError('Failed to create Role.');
          throw new Error(err?.error?.message);
        },
      })
    );
  }



  @Action(EditRole)
  edit(ctx: StateContext<RoleStateModel>, { id }: EditRole) {
    return this.roleService.getRoleById(id).pipe(
      tap({
        next: (selectedRole) => {
          if (!selectedRole) {
            console.error(`Role with ID ${id} not found on the backend.`);
            ctx.patchState({
              selectedRole: null,
            });
            return;
          }
          ctx.patchState({
            selectedRole,
          });
        },
        error: (error) => {
          console.error(`Error fetching role with ID ${id}:`, error.message);
          ctx.patchState({
            selectedRole: null, 
          });
        },
      })
    );
  }






  @Action(UpdateRole)
  updateRole(
    ctx: StateContext<RoleStateModel>,
    { id, payload }: UpdateRole
  ) {
    const state = ctx.getState();

    return this.roleService.updateRole(id, payload).pipe(
      tap({
        next: (updatedRole) => {
          const updatedRoles = state.role.data.map((role) =>
            role.id === id ? { ...role, ...updatedRole } : role
          );
          ctx.patchState({
            role: {
              data: updatedRoles,
              total: state.role.total,
            },
            selectedRole: null, 
          });
          this.notificationService.showSuccess("Role updated successfully.");
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || "Failed to update the role."
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }



  @Action(DeleteRole)
  deleteRole(ctx: StateContext<RoleStateModel>, action: DeleteRole) {
    const state = ctx.getState();

    return this.roleService.deleteRole(action.id).pipe(
      tap({
        next: () => {
         
          const updatedRoles = state.role.data.filter((role) => role.id !== action.id);
          ctx.patchState({
            role: {
              data: updatedRoles,
              total: state.role.total - 1, 
            },
          });

          this.notificationService.showSuccess('Role deleted successfully.');
        },
        error: (err) => {
          
          this.notificationService.showError(err?.error?.message || 'Failed to delete role.');
          throw new Error(err?.error?.message);
        },
      })
    );
  }



  @Action(DeleteAllRole)
  deleteAllRoles(ctx: StateContext<RoleStateModel>, { ids }: DeleteAllRole) {
    const state = ctx.getState();

    return this.roleService.deleteAllRoles(ids).pipe(
      tap({
        next: () => {
        
          const remainingRoles = state.role.data.filter(role => !ids.includes(role.id));

          ctx.patchState({
            role: {
              ...state.role,
              data: remainingRoles,
              total: state.role.total - ids.length, 
            },
          });
          this.notificationService.showSuccess('Roles deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete roles.');
          throw new Error(err?.error?.message || 'Failed to delete roles.');
        },
      })
    );
  }
}

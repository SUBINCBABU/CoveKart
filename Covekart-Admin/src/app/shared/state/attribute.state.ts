import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {
  GetAttributes, GetAttributeValues, CreateAttribute, EditAttribute,
  UpdateAttribute, UpdateAttributeStatus, DeleteAttribute,
  DeleteAllAttribute
} from "../action/attribute.action";
import { Attribute, AttributeModel, AttributeValue } from "../interface/attribute.interface";
import { AttributeService } from "../services/attribute.service";
import { NotificationService } from "../services/notification.service";

export class AttributeStateModel {
  attribute = {
    data: [] as Attribute[],
    total: 0
  }
  attribute_values: AttributeValue[];
  selectedAttribute: Attribute | null;
}

@State<AttributeStateModel>({
  name: "attribute",
  defaults: {
    attribute: {
      data: [],
      total: 0
    },
    attribute_values: [],
    selectedAttribute: null
  },
})
@Injectable()
export class AttributeState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private attributeService: AttributeService) { }

  @Selector()
  static attribute(state: AttributeStateModel) {
    return state.attribute;
  }

  @Selector()
  static attributes(state: AttributeStateModel) {
    return (ids: string) => {
      let attrIds = Array.from(new Set(ids.split(','))).map(Number);
      let filter = attrIds.length ? state.attribute.data.filter(attr => !attrIds.includes(Number(attr.id!))) : state.attribute.data;
      return filter.map((attribute: Attribute) => {
        return { label: attribute?.name, value: attribute?.id, attribute_values: attribute?.attribute_values }
      });
    };
  }

  @Selector()
  static attribute_value(state: AttributeStateModel) {
    return (id: number | null) => {
      if (!id) return [];
      return state?.attribute_values.filter(attr_val => +attr_val.attribute_id === id)?.map((value: AttributeValue) => {
        return { label: value?.value, value: value?.id }
      });
    };
  }

  @Selector()
  static selectedAttribute(state: AttributeStateModel) {
    return state.selectedAttribute;
  }

  // @Action(GetAttributes)
  // getAttributes(ctx: StateContext<AttributeStateModel>, action: GetAttributes) {
  //   return this.attributeService.getAttributes(action.payload).pipe(
  //     tap({
  //       next: result => { 
  //         ctx.patchState({
  //           attribute: {
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




  @Action(GetAttributes)
  getAttributes(ctx: StateContext<AttributeStateModel>, action: GetAttributes) {
    return this.attributeService.getAttributes(action.payload).pipe(
      tap({
        next: (result: AttributeModel) => {
          // Patch the state with the result from the service
          ctx.patchState({
            attribute: {
              data: result.data,
              total: result?.total ?? result.data.length // Assign total attribute count
            }
          });

          // Optionally, show a success notification
          this.notificationService.showSuccess('Attributes fetched successfully.');
        },
        error: (err) => {
          // Optionally, show an error notification
          this.notificationService.showError('Failed to fetch attributes.');
          throw new Error(err?.message);  // Propagate the error
        }
      })
    );
  }


  @Action(GetAttributeValues)
  getAttributeValues(ctx: StateContext<AttributeStateModel>, action: GetAttributeValues) {
    return this.attributeService.getAttributeValues(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            attribute_values: result.data
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  // @Action(CreateAttribute)
  // create(ctx: StateContext<AttributeStateModel>, action: CreateAttribute) {
  //   // Attribute Create Logic Here
  // }



  @Action(CreateAttribute)
  createAttribute(ctx: StateContext<AttributeStateModel>, action: CreateAttribute) {
    const state = ctx.getState();

    return this.attributeService.createAttribute(action.payload).pipe(
      tap({
        next: (result: Attribute) => {
          // Append the new attribute to the state
          ctx.patchState({
            attribute: {
              data: [...state.attribute.data, result],
              total: state.attribute.total + 1, // Increment total count
            },
          });

          // Notify user of successful creation
          this.notificationService.showSuccess('Attribute created successfully.');
        },
        error: (err) => {
          // Notify user of an error
          this.notificationService.showError('Failed to create attribute.');
          throw new Error(err?.error?.message);
        },
      })
    );
  }


  @Action(EditAttribute)
  edit(ctx: StateContext<AttributeStateModel>, { id }: EditAttribute) {
    const state = ctx.getState();
    const result = state.attribute.data.find(attribute => attribute.id == id);
    ctx.patchState({
      ...state,
      selectedAttribute: result
    });
  }

  // @Action(UpdateAttribute)
  // update(ctx: StateContext<AttributeStateModel>, { payload, id }: UpdateAttribute) {
  //   // Attribute Update Logic Here
  // }



  @Action(UpdateAttribute)
  update(ctx: StateContext<AttributeStateModel>, { payload, id }: UpdateAttribute) {
    // Find the index of the attribute to update
    const state = ctx.getState();
    const updatedAttributes = state.attribute.data.map((attribute) => {
      if (attribute.id === id) {
        return { ...attribute, ...payload }; // Update the attribute with new data
      }
      return attribute;
    });

    // Update the state with the new attribute list
    ctx.patchState({
      attribute: {
        data: updatedAttributes,
        total: state.attribute.total
      }
    });

    // Call the service to update the attribute in the backend
    return this.attributeService.updateAttribute(id, payload).pipe(
      tap({
        next: (result) => {
          // Notify success
          this.notificationService.showSuccess('Attribute updated successfully.');
        },
        error: (err) => {
          // Handle error and notify
          this.notificationService.showError('Failed to update attribute.');
          throw new Error(err?.error?.message);
        }
      })
    );
  }



  @Action(UpdateAttributeStatus)
  updateStatus(ctx: StateContext<AttributeStateModel>, { id, status }: UpdateAttributeStatus) {
    // Attribute Status Update Logic Here
  }

  // @Action(DeleteAttribute)
  // delete(ctx: StateContext<AttributeStateModel>, { id }: DeleteAttribute) {
  //   // Delete Attribute Logic Here
  // }


  @Action(DeleteAttribute)
  deleteAttribute(ctx: StateContext<AttributeStateModel>, action: DeleteAttribute) {
    const state = ctx.getState();

    return this.attributeService.deleteAttribute(action.id).pipe(
      tap({
        next: () => {
          // Filter out the deleted attribute from the state
          const updatedAttributes = state.attribute.data.filter(
            (attribute) => attribute.id !== action.id
          );

          // Update the state with the remaining attributes
          ctx.patchState({
            attribute: {
              data: updatedAttributes,
              total: state.attribute.total - 1,  // Decrement total count
            },
          });

          // Notify user of successful deletion
          this.notificationService.showSuccess('Attribute deleted successfully.');
        },
        error: (err) => {
          // Notify user of an error
          this.notificationService.showError('Failed to delete attribute.');
          throw new Error(err?.error?.message);
        },
      })
    );
  }

  // @Action(DeleteAllAttribute)
  // deleteAll(ctx: StateContext<AttributeStateModel>, { ids }: DeleteAllAttribute) {
  //   // Multiple Delete Attribute Logic Here
  // }


  @Action(DeleteAllAttribute)
  deleteAll(ctx: StateContext<AttributeStateModel>, { ids }: DeleteAllAttribute) {
    const state = ctx.getState();

    // Call the service to delete the selected attributes
    return this.attributeService.deleteAttributes(ids).pipe(
      tap({
        next: () => {
          // Filter out the deleted attributes from the state
          const remainingAttributes = state.attribute.data.filter(
            (attribute) => !ids.includes(attribute.id!)
          );

          // Update the state to reflect the remaining attributes
          ctx.patchState({
            attribute: {
              data: remainingAttributes,
              total: state.attribute.total - ids.length,  // Decrease total count
            },
          });

          // Notify user of successful deletion
          this.notificationService.showSuccess('Attributes deleted successfully.');
        },
        error: (err) => {
          // Notify user of an error
          this.notificationService.showError('Failed to delete attributes.');
          throw new Error(err?.error?.message || 'Failed to delete attributes');
        },
      })
    );
  }


}

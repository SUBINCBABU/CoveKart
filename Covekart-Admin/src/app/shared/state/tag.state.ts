import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetTags, CreateTag, EditTag, 
         UpdateTag, UpdateTagStatus, DeleteTag, 
         DeleteAllTag } from "../action/tag.action";
import { Tag, TagModel } from "../interface/tag.interface";
import { TagService } from "../services/tag.service";
import { NotificationService } from "../services/notification.service";

export class TagStateModel {
  tag = {
    data: [] as Tag[],
    total: 0
  }
  selectedTag: Tag | null;
}

@State<TagStateModel>({
  name: "tag",
  defaults: {
    tag: {
      data: [],
      total: 0
    },
    selectedTag: null
  },
})
@Injectable()
export class TagState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private tagService: TagService) {}

  @Selector()
  static tag(state: TagStateModel) {
    return state.tag;
  }

  @Selector()
  static selectedTag(state: TagStateModel) {
    return state.selectedTag;
  }


 

  @Action(GetTags)
  gettags(ctx: StateContext<TagStateModel>, action: GetTags) {
    return this.tagService.getTags(action.payload).pipe(
      tap({
        next: (result: TagModel) => {
          // Patch the state with the result from the service
          ctx.patchState({
            tag: {
              data: result.data,
              total: result?.total ?? result.data.length // Assign total attribute count
            }
          });

          // Optionally, show a success notification
          this.notificationService.showSuccess('Tags fetched successfully.');
        },
        error: (err) => {
          // Optionally, show an error notification
          this.notificationService.showError('Failed to fetch tags.');
          throw new Error(err?.message);  // Propagate the error
        }
      })
    );
  }

@Action(CreateTag)
createTag(ctx: StateContext<TagStateModel>, action: CreateTag) {
  const state = ctx.getState();

  return this.tagService.createTag(action.payload).pipe(
    tap({
      next: (result: Tag) => {
        // Append the new attribute to the state
        ctx.patchState({
          tag: {
            data: [...state.tag.data, result],
            total: state.tag.total + 1, // Increment total count
          },
        });

        // Notify user of successful creation
        this.notificationService.showSuccess('Tag created successfully.');
      },
      error: (err) => {
        // Notify user of an error
        this.notificationService.showError('Failed to create tag.');
        throw new Error(err?.error?.message);
      },
    })
  );
}


  @Action(EditTag)
  edit(ctx: StateContext<TagStateModel>, { id }: EditTag) {
    const state = ctx.getState();
    const result = state.tag.data.find(tag => tag.id == id);
    ctx.patchState({
      ...state,
      selectedTag: result
    });
  }

  // @Action(UpdateTag)
  // update(ctx: StateContext<TagStateModel>, { payload, id }: UpdateTag) {
  //   // Tag Update Logic here
  // }

  @Action(UpdateTag)
  update(ctx: StateContext<TagStateModel>, { payload, id }: UpdateTag) {
    // Find the index of the attribute to update
    const state = ctx.getState();
    const updatedTag = state.tag.data.map((tag) => {
      if (tag.id === id) {
        return { ...tag, ...payload }; // Update the attribute with new data
      }
      return tag;
    });

    // Update the state with the new attribute list
    ctx.patchState({
      tag: {
        data: updatedTag,
        total: state.tag.total
      }
    });

    // Call the service to update the attribute in the backend
    return this.tagService.updateTag(id, payload).pipe(
      tap({
        next: (result) => {
          // Notify success
          this.notificationService.showSuccess('Tag updated successfully.');
        },
        error: (err) => {
          // Handle error and notify
          this.notificationService.showError('Tag to update attribute.');
          throw new Error(err?.error?.message);
        }
      })
    );
  }




  // @Action(UpdateTagStatus)
  // updateStatus(ctx: StateContext<TagStateModel>, { id, status }: UpdateTagStatus) {
  //   // Tag Update Status Logic here
  // }




  @Action(UpdateTagStatus)
updateStatus(ctx: StateContext<TagStateModel>, { id, status }: UpdateTagStatus) {
  const state = ctx.getState();

  return this.tagService.updateTagStatus(id, status).pipe(
    tap({
      next: (updatedTag: Tag) => {
        // Update the tag's status in the state
        const updatedData = state.tag.data.map(tag =>
          tag.id === id ? { ...tag, status: updatedTag.status } : tag
        );

        ctx.patchState({
          tag: {
            ...state.tag,
            data: updatedData,
          },
        });
        window.location.reload();
        // Notify the user of successful status update
        this.notificationService.showSuccess(
         
          `Tag status updated to ${status ? 'Active' : 'Inactive'} successfully.`
        );
      },
      error: (err) => {
        // Notify the user of an error
        window.location.reload();
        this.notificationService.showError('Failed to update tag status.');
        throw new Error(err?.error?.message || 'Failed to update tag status');
      },
     
    })
    
  );
 
}


  // @Action(DeleteTag)
  // delete(ctx: StateContext<TagStateModel>, { id }: DeleteTag) {
  //   // Tag Delete Logic here
  // }


  @Action(DeleteTag)
  deleteTag(ctx: StateContext<TagStateModel>, action: DeleteTag) {
    const state = ctx.getState();

    return this.tagService.deleteTag(action.id).pipe(
      tap({
        next: () => {
          // Filter out the deleted attribute from the state
          const updatedTag = state.tag.data.filter(
            (tag) => tag.id !== action.id
          );

          // Update the state with the remaining attributes
          ctx.patchState({
            tag: {
              data: updatedTag,
              total: state.tag.total - 1,  // Decrement total count
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

  // @Action(DeleteAllTag)
  // deleteAll(ctx: StateContext<TagStateModel>, { ids }: DeleteAllTag) {
  //   // Tag Delete All Logic here
  // }


  @Action(DeleteAllTag)
deleteAll(ctx: StateContext<TagStateModel>, { ids }: DeleteAllTag) {
  const state = ctx.getState();

  return this.tagService.deleteAllTags(ids).pipe(
    tap({
      next: (response) => {
        // Filter out the deleted tags from the state
        const remainingTags = state.tag.data.filter(tag => !ids.includes(tag.id));

        ctx.patchState({
          tag: {
            ...state.tag,
            data: remainingTags,
            total: state.tag.total - ids.length, // Decrease the total count
          },
        });

        // Notify the user of successful deletion
        this.notificationService.showSuccess('Tags deleted successfully.');
      },
      error: (err) => {
        // Notify the user of an error
        this.notificationService.showError('Failed to delete tags.');
        throw new Error(err?.error?.message || 'Failed to delete tags');
      },
    })
  );
}

}

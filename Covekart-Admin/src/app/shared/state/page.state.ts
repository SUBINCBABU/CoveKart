import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {
  GetPages, CreatePage, EditPage,
  UpdatePage, UpdatePageStatus, DeletePage,
  DeleteAllPage
} from "../action/page.action";
import { Page } from "../interface/page.interface";
import { PageService } from "../services/page.service";
import { NotificationService } from "../services/notification.service";

export class PageStateModel {
  page = {
    data: [] as Page[],
    total: 0
  }
  selectedPage: Page | null;
}

@State<PageStateModel>({
  name: "page",
  defaults: {
    page: {
      data: [],
      total: 0
    },
    selectedPage: null
  },
})
@Injectable()
export class PageState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private pageService: PageService) { }

  @Selector()
  static page(state: PageStateModel) {
    return state.page;
  }

  @Selector()
  static pages(state: PageStateModel) {
    return state.page.data.map(res => {
      return { label: res?.title, value: res?.id }
    });
  }

  @Selector()
  static selectedPage(state: PageStateModel) {
    return state.selectedPage;
  }

  @Action(GetPages)
  getPages(ctx: StateContext<PageStateModel>, action: GetPages) {
    return this.pageService.getPages(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            page: {
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

  @Action(CreatePage)
  create(ctx: StateContext<PageStateModel>, action: CreatePage) {
    const state = ctx.getState()

    return this.pageService.createPages(action.payload).pipe(
      tap({
        next: (result: Page) => {

          ctx.patchState({
            page: {
              data: [...state.page.data, result],
              total: state.page.total + 1,
            },
          });
          this.notificationService.showSuccess('page created successfully.')
        },
        error: (err) => {

          this.notificationService.showError('Failed to fetch page.');
          throw new Error(err?.error?.message);
        },
      })
    );

  }


  @Action(EditPage)
  edit(ctx: StateContext<PageStateModel>, { id }: EditPage) {
    const state = ctx.getState();
    const result = state.page.data.find(page => page.id == id);
    ctx.patchState({
      ...state,
      selectedPage: result
    });
  }


  // @Action(UpdatePage)
  // update(ctx: StateContext<PageStateModel>, { payload, id }: UpdatePage) {
  //   // Page Update Logic Here
  // }

  @Action(UpdatePage)
  update(ctx: StateContext<PageStateModel>, { payload, id }: UpdatePage) {
    const state = ctx.getState();
    const updatedPages = state.page.data.map(page => {
      if (page.id === id) {
        return { ...page, ...payload };
      }
      return page;
    });

    ctx.patchState({
      page: {
        data: updatedPages,
        total: state.page.total,
      },
    });

    this.pageService.UpdatePage(id, payload).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('Page updated successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to update page.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }

  @Action(DeletePage)
  delete(ctx: StateContext<PageStateModel>, { id }: DeletePage) {
    const state = ctx.getState();
    const filteredPages = state.page.data.filter(page => page.id !== id);

    ctx.patchState({
      page: {
        data: filteredPages,
        total: state.page.total - 1,
      },
    });

    this.pageService.DeletePage(id).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('Page deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to delete page.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }

  @Action(DeleteAllPage)
  deleteAll(ctx: StateContext<PageStateModel>, { ids }: DeleteAllPage) {

    const state = ctx.getState();

    return this.pageService.deleteAllPages(ids).pipe(
      tap({
        next: () => {
          const remainingPages = state.page.data.filter(page => !ids.includes(page.id));

          ctx.patchState({
            page: {
              ...state.page,
              data: remainingPages,
              total: state.page.total - ids.length,
            },
          });

          this.notificationService.showSuccess('page deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete page.');
          throw new Error(err?.error?.message || 'Failed to delete page.');
        },
      })
    );

  }



  @Action(UpdatePageStatus)
  updateStatus(ctx: StateContext<PageStateModel>, { id, status }: UpdatePageStatus) {
    // Optimistically update the state
    const state = ctx.getState();
    const updatedPages = state.page.data.map(page =>
      page.id === id ? { ...page, status } : page
    );

    ctx.patchState({
      page: {
        data: updatedPages,
        total: state.page.total,
      },
    });


    return this.pageService.updatePageStatus(id, status).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('Page updated successfully.');
        },
        error: (err) => {

          ctx.patchState({
            page: {
              data: state.page.data,
              total: state.page.total,
            },
          });
          this.notificationService.showError('Failed to update page.');
          console.error(err);
        },
      })
    );
  }


  // @Action(UpdatePageStatus)
  // updateStatus(ctx: StateContext<PageStateModel>, { id, status }: UpdatePageStatus) {
  //   // Page Update Status Logic Here
  // }

  // @Action(DeletePage)
  // delete(ctx: StateContext<PageStateModel>, { id }: DeletePage) {
  //   // Page Delete Logic Here
  // }

  // @Action(DeleteAllPage)
  // deleteAll(ctx: StateContext<PageStateModel>, { ids }: DeleteAllPage) {
  //   // Page Multiple Delete Logic Here
  // }

}


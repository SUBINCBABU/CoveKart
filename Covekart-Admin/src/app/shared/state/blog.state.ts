import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {
  GetBlogs, CreateBlog, EditBlog,
  UpdateBlog, UpdateBlogStatus, DeleteBlog,
  DeleteAllBlog
} from "../action/blog.action";
import { Blog } from "../interface/blog.interface";
import { BlogService } from "../services/blog.service";
import { NotificationService } from "../services/notification.service";

export class BlogStateModel {
  blog = {
    data: [] as Blog[],
    total: 0
  }
  selectedBlog: Blog | null;
}

@State<BlogStateModel>({
  name: "blog",
  defaults: {
    blog: {
      data: [],
      total: 0
    },
    selectedBlog: null
  },
})
@Injectable()
export class BlogState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private blogService: BlogService) { }

  @Selector()
  static blog(state: BlogStateModel) {
    return state.blog;
  }

  @Selector()
  static blogs(state: BlogStateModel) {
    return state.blog.data.map(res => {
      return { label: res?.title, value: res?.id }
    });
  }

  @Selector()
  static selectedBlog(state: BlogStateModel) {
    return state.selectedBlog;
  }

  @Action(GetBlogs)
  getBlogs(ctx: StateContext<BlogStateModel>, action: GetBlogs) {
    return this.blogService.getBlogs(action.payload).pipe(
      tap({
        next: (result) => {
         

          ctx.patchState({
            blog: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length,
            },
          });
        },
        error: (err) => {
          this.notificationService.showError("Failed to fetch blogs.");
          throw new Error(err?.error?.message);
        },
      })
    );
  }

  @Action(CreateBlog)
  create(ctx: StateContext<BlogStateModel>, action: CreateBlog) {
    return this.blogService.createBlog(action.payload).pipe(
      tap({
        next: (result) => {
          const state = ctx.getState();
          ctx.patchState({
            blog: {
              data: [...state.blog.data, result],
              total: state.blog.total + 1
            },
          });
          this.notificationService.showSuccess("Blog created successfully!");
        },
        error: (err) => {
          this.notificationService.showError("Failed to create blog.");
          throw new Error(err?.error?.message);
        },
      })
    );
  }


  @Action(EditBlog)
  edit(ctx: StateContext<BlogStateModel>, { id }: EditBlog) {
    return this.blogService.EditBlog(id).pipe(
      tap({
        next: (result: Blog) => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedBlog: result,

          });
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || 'Failed to fetch Blog details for editing.'
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }



  @Action(UpdateBlog)
  update(ctx: StateContext<BlogStateModel>, { payload, id }: UpdateBlog) {
    const state = ctx.getState();
    return this.blogService.updateBlog(id, payload).pipe(
      tap({
        next: (updatedblog: Blog) => {
          const updatedBlogs = state.blog.data.map(blog => blog.id === id ? updatedblog : blog);
          ctx.patchState({
            blog: {
              data: updatedBlogs,
              total: state.blog.total
            },
            selectedBlog: null
          });
          this.notificationService.showSuccess('blog updated successfully.');
        },
        error: err => {
          this.notificationService.showError(err?.error?.message || 'Failed to update blog.');
        },
      })
    );
  }



  @Action(UpdateBlogStatus)
  updateStatus(ctx: StateContext<BlogStateModel>, { id, status }: UpdateBlogStatus) {
    const state = ctx.getState();
    const updatedBlogs = state.blog.data.map(blog =>
      blog.id === id ? { ...blog, status } : blog
    );

    ctx.patchState({
      blog: {
        data: updatedBlogs,
        total: state.blog.total,
      },
    });


    return this.blogService.updateBlogStatus(id, status).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('blog updated successfully.');
        },
        error: (err) => {

          ctx.patchState({
            blog: {
              data: state.blog.data,
              total: state.blog.total,
            },
          });
          this.notificationService.showError('Failed to update blog.');
          console.error(err);
        },
      })
    );
  }


  @Action(DeleteAllBlog)
  deleteAll(ctx: StateContext<BlogStateModel>, { ids }: DeleteAllBlog) {

    const state = ctx.getState();

    return this.blogService.deleteAllBlog(ids).pipe(
      tap({
        next: () => {
          const remainingBlogs = state.blog.data.filter(blog => !ids.includes(blog.id));

          ctx.patchState({
            blog: {
              ...state.blog,
              data: remainingBlogs,
              total: state.blog.total - ids.length,
            },
          });

          this.notificationService.showSuccess('blog deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete blog.');
          throw new Error(err?.error?.message || 'Failed to delete blog.');
        },
      })
    );

  }

  @Action(DeleteBlog)
  delete(ctx: StateContext<BlogStateModel>, { id }: DeleteBlog) {
    const state = ctx.getState();
    const filteredPages = state.blog.data.filter(blog => blog.id !== id);

    ctx.patchState({
      blog: {
        data: filteredPages,
        total: state.blog.total - 1,
      },
    });

    this.blogService.DeleteBlog(id).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('blog deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to delete blog.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }

}

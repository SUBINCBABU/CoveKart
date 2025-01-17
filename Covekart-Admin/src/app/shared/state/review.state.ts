import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetReviews, DeleteReview, DeleteAllReview } from "../action/review.action";
import { Review } from "../interface/review.interface";
import { ReviewService } from "../services/review.service";
import { NotificationService } from "../services/notification.service";

export class ReviewStateModel {
  review = {
    data: [] as Review[],
    total: 0
  }
}

@State<ReviewStateModel>({
  name: "review",
  defaults: {
    review: {
      data: [],
      total: 0
    },
  },
})

@Injectable()
export class ReviewState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private reviewService: ReviewService) { }

  @Selector()
  static review(state: ReviewStateModel) {
    return state.review;
  }

  @Action(GetReviews)
  getReviews(ctx: StateContext<ReviewStateModel>, action: GetReviews) {
    return this.reviewService.getReviews(action?.payload).pipe(
      tap({
        next: result => {
        
          ctx.patchState({
            review: {
              data: result.data,
              total: result?.total ? result?.total : result.data.length
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  // @Action(DeleteReview)
  // delete(ctx: StateContext<ReviewStateModel>, { id }: DeleteReview) {
  //   // Review Delete Logic Here
  // }




  @Action(DeleteReview)
  delete(ctx: StateContext<ReviewStateModel>, { id }: DeleteReview) {
    const state = ctx.getState();
    const filteredReviews = state.review.data.filter(review => review.id !== id);

    ctx.patchState({
      review: {
        data: filteredReviews,
        total: state.review.total - 1,
      },
    });

    this.reviewService.deleteReviews(id).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('Review deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to delete Review.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }




  @Action(DeleteAllReview)
  deleteAll(ctx: StateContext<ReviewStateModel>, { ids }: DeleteAllReview) {

    const state = ctx.getState();

    return this.reviewService.deleteAllReviews(ids).pipe(
      tap({
        next: () => {
          const remainingReviews = state.review.data.filter(review => !ids.includes(review.id));

          ctx.patchState({
            review: {
              ...state.review,
              data: remainingReviews,
              total: state.review.total - ids.length,
            },
          });

          this.notificationService.showSuccess('Review deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete Review.');
          throw new Error(err?.error?.message || 'Failed to delete Review.');
        },
      })
    );

  }


} 

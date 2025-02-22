import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { NotificationService } from "../services/notification.service";
import { ReviewService } from "../services/review.service";
import { Review } from "../interface/review.interface";
import { GetReview, SendReview, UpdateReview } from "../action/review.action";

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
      total: 0,
    },
  },
})
@Injectable()
export class ReviewState {

  constructor(private reviewsService: ReviewService) { }

  @Selector()
  static review(state: ReviewStateModel) {
    return state.review;
  }

  @Action(GetReview)
  getReview(ctx: StateContext<ReviewStateModel>, action: GetReview) {
    return this.reviewsService.getReview(action.payload).pipe(
      tap({
        next: (result) => {
          ctx.patchState({
            review: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });

        },
        error: err => {
          console.error('Error fetching reviews:', err);
          throw new Error(err?.error?.message || 'Failed to fetch reviews');
        }
      })
    );
  }



  // @Action(SendReview)
  // sendReview(ctx: StateContext<ReviewStateModel>, action: SendReview) {
  //   this.reviewsService.skeletonLoader = true;
  //   return this.reviewsService.addReview(action.payload).pipe(
  //     tap({
  //       next: (result) => {
  //         const state = ctx.getState();
  //         ctx.patchState({
  //           review: {
  //             data: result.data,
  //             total: state.review.total + 1,
  //           },
  //         });
  //       },
  //       complete: () => {
  //         this.reviewsService.skeletonLoader = false;
  //       },
  //       error: (err) => {
  //         throw new Error(err?.error?.message);
  //       },
  //     })
  //   );
  // }


  
  @Action(SendReview)
  sendReview(ctx: StateContext<ReviewStateModel>, action: SendReview) {
    this.reviewsService.skeletonLoader = true;
    return this.reviewsService.addReview(action.payload).pipe(
      tap({
        next: (result) => {
          const state = ctx.getState();
          ctx.patchState({
            review: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        complete: () => {
          this.reviewsService.skeletonLoader = false;
        },
        error: (err) => {
          console.error('Error sending review:', err);
          throw new Error(err?.error?.message || 'Failed to send review');
        }
      })
    );
  }

  // @Action(SendQuestion)
  // sendReview(ctx: StateContext<QuestionStateModel>, action: SendQuestion) {
  //   this.questionsAnswersService.skeletonLoader = true;
  //   return this.questionsAnswersService.sendQuestion(action.payload).pipe(
  //     tap({
  //       next: (result) => {
  //         const state = ctx.getState();
  //         ctx.patchState({
  //           question: {
  //             data: result.data,
  //             total: state.question.total + 1,
  //           },
  //         });
  //       },
  //       complete: () => {
  //         this.questionsAnswersService.skeletonLoader = false;
  //       },
  //       error: (err) => {
  //         throw new Error(err?.error?.message);
  //       },
  //     })
  //   );
  // }

  @Action(UpdateReview)
  update(ctx: StateContext<ReviewStateModel>, { payload, id }: UpdateReview) {

    return this.reviewsService.updateReview(id, payload).pipe(
      tap({
        next: (result) => {
          const state = ctx.getState();

          const updatedReviews = state.review.data.map(review => 
            review.id === id ? result.data[0] : review
          );

          ctx.patchState({
            review: {
              data: updatedReviews,
              total: state.review.total
            }
          });
          window.location.reload()
        },
        error: (err) => {
          console.error('Error updating review:', err);
          throw new Error(err?.error?.message || 'Failed to update review');
        }
      })
    );
  }


}
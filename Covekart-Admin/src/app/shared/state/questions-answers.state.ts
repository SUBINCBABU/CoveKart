import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { QuestionsAnswersService } from "../services/questions-answers.service";
import {
  GetQuestionAnswers, EditQuestionAnswers, UpdateQuestionAnswers,
  DeleteAllQuestionAnswers, DeleteQuestionAnswers
} from "../action/questions-answers.action";
import { QuestionAnswers } from "../interface/questions-answers.interface";

export class QuestionAnswersStateModel {
  question = {
    data: [] as QuestionAnswers[],
    total: 0
  }
  selectedQuestion: QuestionAnswers | null;
}

@State<QuestionAnswersStateModel>({
  name: "question",
  defaults: {
    question: {
      data: [],
      total: 0
    },
    selectedQuestion: null
  },
})
@Injectable()
export class QuestionAnswersState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private questionsAnswersService: QuestionsAnswersService) { }

  @Selector()
  static questionAnswers(state: QuestionAnswersStateModel) {
    return state.question;
  }

  @Selector()
  static selectedQuestionAnswers(state: QuestionAnswersStateModel) {
    return state.selectedQuestion;
  }

  @Action(GetQuestionAnswers)
  getQuestionAnswers(ctx: StateContext<QuestionAnswersStateModel>, action: GetQuestionAnswers) {
    return this.questionsAnswersService.getQuestionAnswers(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            question: {
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
  // @Action(EditQuestionAnswers)
  // edit(ctx: StateContext<QuestionAnswersStateModel>, { id }: EditQuestionAnswers) {
  //   const state = ctx.getState();
  //   const result = state.question.data.find(question => question.id == id);
  //   ctx.patchState({
  //     ...state,
  //     selectedQuestion: result
  //   });
  // }

  // @Action(UpdateQuestionAnswers)
  // update(ctx: StateContext<QuestionAnswersStateModel>, { payload, id }: UpdateQuestionAnswers) {
  //   // Update Logic Here
  // }

  // @Action(DeleteQuestionAnswers)
  // delete(ctx: StateContext<QuestionAnswersStateModel>, { id }: DeleteQuestionAnswers) {
  //   // Delete Logic Here
  // }

  // @Action(DeleteAllQuestionAnswers)
  // deleteAll(ctx: StateContext<QuestionAnswersStateModel>, { ids }: DeleteAllQuestionAnswers) {
  //   // Delete All Logic Here
  // }



  @Action(EditQuestionAnswers)
  edit(ctx: StateContext<QuestionAnswersStateModel>, { id }: EditQuestionAnswers) {
    return this.questionsAnswersService.EditQuestionAnswers(id).pipe(
      tap({
        next: (result: QuestionAnswers) => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedQuestion: result,

          });
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || 'Failed to fetch Coupon details for editing.'
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }


  @Action(UpdateQuestionAnswers)
  update(ctx: StateContext<QuestionAnswersStateModel>, { payload, id }: UpdateQuestionAnswers) {
    const state = ctx.getState();
    const updatedQuestionAnswers = state.question.data.map(question => {
      if (question.id === id) {
        return { ...question, ...payload };
      }
      return question;
    });

    ctx.patchState({
      question: {
        data: updatedQuestionAnswers,
        total: state.question.total,
      },
    });

    this.questionsAnswersService.UpdateQuestionAnswers(id, payload).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('questionsAnswers updated successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to update questionsAnswers.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }

  @Action(DeleteQuestionAnswers)
  delete(ctx: StateContext<QuestionAnswersStateModel>, { id }: DeleteQuestionAnswers) {
    const state = ctx.getState();
    const filteredQuestionAnswers = state.question.data.filter(coupon => coupon.id !== id);

    ctx.patchState({
      question: {
        data: filteredQuestionAnswers,
        total: state.question.total - 1,
      },
    });

    this.questionsAnswersService.DeleteQuestionAnswers(id).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('QuestionAnswers deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError('Failed to delete QuestionAnswers.');
          throw new Error(err?.error?.message);
        },
      })
    ).subscribe();
  }


  @Action(DeleteAllQuestionAnswers)
  deleteAll(ctx: StateContext<QuestionAnswersStateModel>, { ids }: DeleteAllQuestionAnswers) {

    const state = ctx.getState();

    return this.questionsAnswersService.deleteAllQuestionAnswers(ids).pipe(
      tap({
        next: () => {
          const remainingCoupons = state.question.data.filter(coupon => !ids.includes(coupon.id));

          ctx.patchState({
            question: {
              ...state.question,
              data: remainingCoupons,
              total: state.question.total - ids.length,
            },
          });

          this.notificationService.showSuccess('questionsAnswers deleted successfully.');
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete questionsAnswers.');
          throw new Error(err?.error?.message || 'Failed to delete questionsAnswers.');
        },
      })
    );

  }

}

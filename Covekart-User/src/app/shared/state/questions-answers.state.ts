import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { QuestionsAnswersService } from "../services/questions-answers.service";
import { Feedback, GetQuestionAnswers, SendQuestion, UpdateQuestionAnswers } from "../action/questions-answers.action";
import { QuestionAnswers } from "../interface/questions-answers.interface";

export class QuestionStateModel {
  question = {
    data: [] as QuestionAnswers[],
    total: 0
  }

}

@State<QuestionStateModel>({
  name: "question",
  defaults: {
    question: {
      data: [],
      total: 0
    },

  },

})
@Injectable()
export class QuestionAnswersState {
  notificationService: any;

  constructor(private questionsAnswersService: QuestionsAnswersService) { }

  @Selector()
  static questionsAnswers(state: QuestionStateModel) {
    return state.question;
  }

  @Action(GetQuestionAnswers)
  getQuestionAnswers(ctx: StateContext<QuestionStateModel>, action: GetQuestionAnswers) {
    this.questionsAnswersService.skeletonLoader = true;
    return this.questionsAnswersService.getQuestionAnswers(action.slug).pipe(
      tap({
        next: result => {
          ctx.patchState({
            question: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        complete: () => {
          this.questionsAnswersService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(SendQuestion)
  sendReview(ctx: StateContext<QuestionStateModel>, action: SendQuestion) {
    this.questionsAnswersService.skeletonLoader = true;
    return this.questionsAnswersService.sendQuestion(action.payload).pipe(
      tap({
        next: (result) => {
          const state = ctx.getState();
          ctx.patchState({
            question: {
              data: result.data,
              total: state.question.total + 1,
            },
          });
        },
        complete: () => {
          this.questionsAnswersService.skeletonLoader = false;
        },
        error: (err) => {
          throw new Error(err?.error?.message);
        },
      })
    );
  }


  @Action(UpdateQuestionAnswers)
  update(ctx: StateContext<QuestionStateModel>, { payload, id }: UpdateQuestionAnswers) {
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

    this.questionsAnswersService.updateQuestion(id, payload).pipe(
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


  @Action(Feedback)
  Feedback(ctx: StateContext<QuestionStateModel>, action: Feedback) {
    const state = ctx.getState();
    const question = [...state.question.data];
    const index = question.findIndex(
      (item) => Number(item.id) === Number(action.payload['question_and_answer_id'])
    );

    if (index === -1) {
      throw new Error("Question not found");
    }

    // Optimistically update the local state
    const currentReaction = question[index].reaction;
    const newReaction = action.payload['reaction'];

    if (currentReaction === newReaction) {
      // User is removing their reaction
      if (newReaction === 'liked') {
        question[index].total_likes -= 1;
      } else if (newReaction === 'disliked') {
        question[index].total_dislikes -= 1;
      }
      question[index].reaction = null;
    } else {
      // User is changing or adding their reaction
      if (currentReaction === 'liked') {
        question[index].total_likes -= 1;
      } else if (currentReaction === 'disliked') {
        question[index].total_dislikes -= 1;
      }

      if (newReaction === 'liked') {
        question[index].total_likes += 1;
      } else if (newReaction === 'disliked') {
        question[index].total_dislikes += 1;
      }
      question[index].reaction = newReaction;
    }

    ctx.patchState({
      ...state,
      question: {
        data: question,
        total: state.question.total,
      },
    });

    // Call the service to persist the reaction
    return this.questionsAnswersService.sendFeedback(action.payload).pipe(
      tap({
        next: () => {
          
        },
        error: (err) => {
          console.error("Failed to update feedback:", err);
         
          ctx.patchState({
            ...state,
          });
        },
      })
    );
  }




}

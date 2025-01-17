import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { FaqService } from "../services/faq.service";
import { Faq } from "../interface/faq.interface";
import {
  CreateFaq, DeleteAllFaq, DeleteFaq,
  EditFaq, GetFaqs, UpdateFaq,
  UpdateFaqStatus
} from "../action/faq.action";

export class FaqStateModel {
  faq = {
    data: [] as Faq[],
    total: 0
  }
  selectedFaq: Faq | null;
}

@State<FaqStateModel>({
  name: "faq",
  defaults: {
    faq: {
      data: [],
      total: 0
    },
    selectedFaq: null
  },
})
@Injectable()
export class FaqState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private faqService: FaqService) { }

  @Selector()
  static faq(state: FaqStateModel) {
    return state.faq;
  }

  @Selector()
  static selectedFaq(state: FaqStateModel) {
    return state.selectedFaq;
  }


  @Action(GetFaqs)
  getFaqs(ctx: StateContext<FaqStateModel>, action: GetFaqs) {
    return this.faqService.getFaqs(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            faq: {
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


  @Action(CreateFaq)
  create(ctx: StateContext<FaqStateModel>, action: CreateFaq) {
    const state = ctx.getState()

    return this.faqService.createFaqs(action.payload).pipe(
      tap({
        next: (result: Faq) => {

          ctx.patchState({
            faq: {
              data: [...state.faq.data, result],
              total: state.faq.total + 1,
            },
          });
          this.notificationService.showSuccess('Faq created successfully.')
        },
        error: (err) => {

          this.notificationService.showError('Failed to fetch Faq.');
          throw new Error(err?.error?.message);
        },
      })
    );

  }


  @Action(EditFaq)
  edit(ctx: StateContext<FaqStateModel>, { id }: EditFaq) {
    return this.faqService.EditFaq(id).pipe(
      tap({
        next: (result: Faq) => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedFaq: result,

          });
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || 'Failed to fetch FAQ details for editing.'
          );
          throw new Error(error?.error?.message);
        },
      })
    );
  }


  @Action(UpdateFaq)
  update(ctx: StateContext<FaqStateModel>, { payload, id }: UpdateFaq) {
    const state = ctx.getState();
    return this.faqService.UpdateFaq(id, payload).pipe(
      tap({
        next: (updatedFaq: Faq) => {
          const updatedFaqs = state.faq.data.map(faq => faq.id === id ? updatedFaq : faq);
          ctx.patchState({
            faq: {
              data: updatedFaqs,
              total: state.faq.total
            },
            selectedFaq: null
          });
          this.notificationService.showSuccess('FAQ updated successfully.');
        },
        error: err => {
          this.notificationService.showError(err?.error?.message || 'Failed to update FAQ.');
        },
      })
    );
  }

  @Action(UpdateFaqStatus)
  updateStatus(ctx: StateContext<FaqStateModel>, { id, status }: UpdateFaqStatus) {
    const state = ctx.getState();
    return this.faqService.updateFaqStatus(id, status).pipe(
      tap({
        next: (updatedFaq: Faq) => {
          const updatedFaqs = state.faq.data.map(faq => faq.id === id ? updatedFaq : faq);
          ctx.patchState({
            faq: {
              data: updatedFaqs,
              total: state.faq.total
            }
          });
          this.notificationService.showSuccess('FAQ status updated successfully.');
        },
        error: err => {
          this.notificationService.showError(err?.error?.message || 'Failed to update FAQ status.');
        },
      })
    );
  }

  @Action(DeleteFaq)
  delete(ctx: StateContext<FaqStateModel>, { id }: DeleteFaq) {
    const state = ctx.getState();
    return this.faqService.DeleteFaq(id).pipe(
      tap({
        next: () => {
          const filteredFaqs = state.faq.data.filter(faq => faq.id !== id);
          ctx.patchState({
            faq: {
              data: filteredFaqs,
              total: state.faq.total - 1
            }
          });
          this.notificationService.showSuccess('FAQ deleted successfully.');
        },
        error: err => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete FAQ.');
        },
      })
    );
  }

  @Action(DeleteAllFaq)
  deleteAll(ctx: StateContext<FaqStateModel>, { ids }: DeleteAllFaq) {
    const state = ctx.getState();
    return this.faqService.deleteAllFaq(ids).pipe(
      tap({
        next: () => {
          const filteredFaqs = state.faq.data.filter(faq => !ids.includes(faq.id));
          ctx.patchState({
            faq: {
              data: filteredFaqs,
              total: filteredFaqs.length
            }
          });
          this.notificationService.showSuccess('Selected FAQs deleted successfully.');
        },
        error: err => {
          this.notificationService.showError(err?.error?.message || 'Failed to delete selected FAQs.');
        },
      })
    );
  }
}
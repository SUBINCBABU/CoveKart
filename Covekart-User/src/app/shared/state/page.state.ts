import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PageService } from "../services/page.service";
import { ContactUs, GetFaqs } from "../action/page.action";
import { ContactUsModel, Faq, Page } from "../interface/page.interface";

export class PageStateModel {
  page = {
    data: [] as Page[],
    total: 0
  }
  faq = {
    data: [] as Faq[],
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
    faq: {
      data: [],
      total: 0
    },
    selectedPage: null,
  },
})
@Injectable()
export class PageState {

  constructor(private pageService: PageService ) {}

  @Selector()
  static faq(state: PageStateModel) {
    return state.faq;
  }

  @Action(GetFaqs)
  getFaqs(ctx: StateContext<PageStateModel>) {
    this.pageService.skeletonLoader = true;
    return this.pageService.getFaqs().pipe(
      tap({
        next: result => {
          ctx.patchState({
            faq: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        complete: () => {
          this.pageService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ContactUs)
  contactUs(ctx: StateContext<ContactUsModel>, { payload }: ContactUs) {
    // contact api logic here
  }

}

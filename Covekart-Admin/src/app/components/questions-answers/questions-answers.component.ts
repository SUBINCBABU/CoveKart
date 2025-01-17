import { Component, ViewChild } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetQuestionAnswers, DeleteQuestionAnswers, 
        DeleteAllQuestionAnswers } from '../../shared/action/questions-answers.action';
import { Stores } from '../../shared/interface/store.interface';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { QuestionAnswersState } from '../../shared/state/questions-answers.state';
import { AnswersModalComponent } from './answers-modal/answers-modal.component';
import { QnAModel, QuestionAnswers } from '../../shared/interface/questions-answers.interface';

@Component({
  selector: 'app-questions-answers',
  templateUrl: './questions-answers.component.html',
  styleUrls: ['./questions-answers.component.scss']
})
export class QuestionsAnswersComponent {

  @Select(QuestionAnswersState.questionAnswers) questionAnswers$: Observable<QnAModel>;
  
  @ViewChild("answersModal") AnswersModal: AnswersModalComponent;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "Question", dataField: "question" },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "store.edit"  },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "store.destroy"  },
    ],
    data: [] as QuestionAnswers[], 
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.questionAnswers$.subscribe(questionAnswers => { 
      this.tableConfig.data  = questionAnswers.data ? questionAnswers.data : [];
      this.tableConfig.total = questionAnswers?.total  ? questionAnswers?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetQuestionAnswers(data!));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.AnswersModal.openModal(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }
 

  delete(data: Stores) {
    this.store.dispatch(new DeleteQuestionAnswers(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllQuestionAnswers(ids));
  }

}

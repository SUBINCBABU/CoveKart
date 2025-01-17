import { Component, Input, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { QuestionAnswersState } from '../../../../../../shared/state/questions-answers.state';
import { ReviewState } from '../../../../../../shared/state/review.state';
import { GetQuestionAnswers } from '../../../../../../shared/action/questions-answers.action';
import { GetReview } from '../../../../../../shared/action/review.action';
import { QnAModel } from '../../../../../../shared/interface/questions-answers.interface';
import { Product } from '../../../../../../shared/interface/product.interface';
import { ReviewModel } from '../../../../../../shared/interface/review.interface';

@Component({
  selector: 'app-product-details-tabs',
  templateUrl: './product-details-tabs.component.html',
  styleUrls: ['./product-details-tabs.component.scss']
})
export class ProductDetailsTabsComponent {

  @Input() product: Product | null;

  @Select(QuestionAnswersState.questionsAnswers) question$: Observable<QnAModel>;
  @Select(ReviewState.review) review$: Observable<ReviewModel>;

  public active = 'description';

  constructor(private store: Store){}

  ngOnChanges(changes: SimpleChanges) {
    let product = changes['product']?.currentValue;
    this.store.dispatch(new GetQuestionAnswers({product_id: product.id}));
    this.store.dispatch(new GetReview({product_id: product.id}));
  }
}

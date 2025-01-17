import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Params } from '../../shared/interface/core.interface';
import { Review, ReviewModel } from '../../shared/interface/review.interface';
import { ReviewState } from '../../shared/state/review.state';
import { GetReviews, DeleteReview, DeleteAllReview } from '../../shared/action/review.action';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {

  @Select(ReviewState.review) review$: Observable<ReviewModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "image", dataField: "product_review_image", class: 'tbl-image', type: 'image', placeholder: 'assets/images/product.png' },
      { title: "consumer_name", dataField: "consumer_name" },
      { title: "product_name", dataField: "product_name" },
      { title: "rating", dataField: "rating", type: "rating", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' }
    ],
    rowActions: [
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "review.destroy" },
    ],
    data: [] as Review[],
    total: 0
  };

  constructor(private store: Store) {
    this.store.dispatch(new GetReviews());
  }

  ngOnInit() {
    this.review$.subscribe(review => {
      let reviews = review?.data?.filter((element: Review) => {
        element.product_review_image = element?.product?.product_thumbnail
        element.consumer_name = element?.consumer?.name
        element.product_name = element?.product?.name
        return element;
      });
      this.tableConfig.data = review ? reviews : [];
      this.tableConfig.total = review ? review.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetReviews(data!))
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'delete')
      this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data);
  }

  delete(data: Review) {
    this.store.dispatch(new DeleteReview(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllReview(ids));
  }

}

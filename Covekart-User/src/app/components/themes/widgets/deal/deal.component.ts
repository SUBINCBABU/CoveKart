import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductState } from '../../../../shared/state/product.state';
import { ProductModel } from '../../../../shared/interface/product.interface';
import * as data from '../../../../shared/data/owl-carousel'
import { Deal, DealOfDays } from '../../../../shared/interface/theme.interface';
import { AddToWishlist } from '../../../../shared/action/wishlist.action';
import { AddToCompare } from '../../../../shared/action/compare.action';
import { ProductDetailModalComponent } from 'src/app/shared/components/widgets/modal/product-detail-modal/product-detail-modal.component';


@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})
export class DealComponent {

  @Input() data?: DealOfDays;

  @Select(ProductState.product) product$: Observable<ProductModel>;
  @ViewChild("productDetailModal") productDetailModal: ProductDetailModalComponent;

  public dealSlider = data.singleSlider
  public deals: Deal[] = [];

  constructor(public config: NgbRatingConfig, private store: Store) {
		config.max = 5;
		config.readonly = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    let dealsArray = changes['data']?.currentValue?.deals;
    this.product$.subscribe(products => {
      dealsArray.map((deal:any) => {
        deal.product = products?.data.find(product => product.id === deal.product_id)
      })
      this.deals = dealsArray;
      this.startTimers();
    });
  }

  startTimers() {
    for (let counterItem of this.deals) {
      const endDate = new Date(counterItem.end_date).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = endDate - currentTime;

      if (timeDifference > 0) {
        counterItem.remainingTime = this.calculateRemainingTime(timeDifference);
        setInterval(() => {
          counterItem.remainingTime = this.calculateRemainingTime(endDate - new Date().getTime());
        }, 1000);
      }
    }
  }

  calculateRemainingTime(timeDifference: number) {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }


  addToWishlist(id: number) {
    this.store.dispatch(new AddToWishlist({ product_id: id }));
  }

  addToCompare(id: number) {
    this.store.dispatch(new AddToCompare({ product_id: id }));
  }
}

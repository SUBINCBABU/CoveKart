import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetWishlist } from './../../../shared/action/wishlist.action';
import { WishlistState } from '../../../shared/state/wishlist.state';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { WishlistModel } from '../../../shared/interface/wishlist.interface';
import { WishlistService } from '../../../shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {

  @Select(WishlistState.wishlistItems) wishlistItems$: Observable<WishlistModel>;

  public breadcrumb: Breadcrumb = {
    title: "Wishlist",
    items: [{ label: 'Wishlist', active: true }]
  }

  public skeletonItems = Array.from({ length: 12 }, (_, index) => index);

  constructor(private store: Store, 
    public wishlistService: WishlistService){
    this.store.dispatch(new GetWishlist())
  }
}

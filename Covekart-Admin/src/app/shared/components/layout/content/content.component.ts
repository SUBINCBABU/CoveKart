import { Component } from "@angular/core";
import { Store } from "@ngxs/store";
import { NavService } from "../../../services/nav.service";
import { GetNotification } from './../../../action/notification.action';
import { GetBadges } from './../../../action/menu.action';
import { GetUserDetails } from './../../../action/account.action';

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent {

  constructor(private store: Store,
    public navServices: NavService) {
    this.store.dispatch(new GetBadges());
    this.store.dispatch(new GetNotification());
    this.store.dispatch(new GetUserDetails()).subscribe({
      complete: () => {
        this.navServices.sidebarLoading = false;
      }
    });
  }
  

}

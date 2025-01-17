import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NotificationState } from '../../shared/state/notification.state';
import { GetNotification, MarkAsReadNotification } from '../../shared/action/notification.action';
import { Notification } from "../../shared/interface/notification.interface";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  @Select(NotificationState.notification) notification$: Observable<Notification[]>;

  constructor(private store: Store) {
    this.store.dispatch(new GetNotification());
  }

  ngOnDestroy() {
    this.store.dispatch(new MarkAsReadNotification());
  }

}

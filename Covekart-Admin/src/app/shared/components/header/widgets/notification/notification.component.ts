import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Notification } from '../../../../../shared/interface/notification.interface';
import { NavService } from '../../../../../shared/services/nav.service';
import { NotificationState } from '../../../../../shared/state/notification.state';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  
  @Select(NotificationState.notification) notification$: Observable<Notification[]>;

  public unreadNotificationCount: number;
  public active: boolean = false;

  constructor( public navServices: NavService ) {
    this.notification$.subscribe((notification) => {
      this.unreadNotificationCount = notification?.filter(item => !item.read_at)?.length;
    });
  }

  clickHeaderOnMobile(){
    this.active= !this.active
  }
}

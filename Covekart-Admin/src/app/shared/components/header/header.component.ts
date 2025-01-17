import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountUser } from "../../interface/account.interface";
import { AccountState } from '../../state/account.state';
import { NotificationState } from '../../state/notification.state';
import { NavService } from "../../services/nav.service";
import { Notification } from "../../interface/notification.interface";
import { SettingState } from "../../state/setting.state";
import { Values, Language } from "../../interface/setting.interface";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {

  @Select(AccountState.user) user$: Observable<AccountUser>;
  @Select(SettingState.setting) setting$: Observable<Values>;
  @Select(NotificationState.notification) notification$: Observable<Notification[]>;

  public unreadNotificationCount: number;

  public active: boolean = false;
  public profileOpen: boolean = false;
  public open: boolean = false;

  public languages: Language[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us'
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr'
    },
  ];

  public selectedLanguage: Language = {
    language: 'English',
    code: 'en',
    icon: 'us'
  }

  constructor(@Inject(DOCUMENT) private document: Document,
  public navServices: NavService ) {
    this.notification$.subscribe((notification) => {
      this.unreadNotificationCount = notification?.filter(item => !item.read_at)?.length;
    });
    this.setting$.subscribe(setting => {
      document.body.classList.add(setting?.general?.mode!);
    })
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  clickHeaderOnMobile(){
    this.navServices.search = true;
  }

}

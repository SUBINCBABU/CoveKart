import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ofActionDispatched, Actions, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from './shared/action/auth.action';
import { SettingState } from './shared/state/setting.state';
import { GetSettingOption } from './shared/action/setting.action';
import { Values } from './shared/interface/setting.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  @Select(SettingState.setting) setting$: Observable<Values>;

  public favIcon: HTMLLinkElement | null;

  constructor(config: NgbNavConfig, 
    @Inject(DOCUMENT) document: Document,
    private actions: Actions, private router: Router,
    private titleService: Title, private store: Store,
    private translate: TranslateService) {
      this.translate.use('en');
      this.store.dispatch(new GetSettingOption());
      this.setting$.subscribe(setting => {
        // Set Direction
        if(setting?.general?.admin_site_language_direction === 'rtl'){
          document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
          document.body.classList.add('ltr');
        }else {
          document.getElementsByTagName('html')[0].removeAttribute('dir');
          document.body.classList.remove('rtl');
        }

        // Set Favicon
        this.favIcon = document.querySelector('#appIcon');
        this.favIcon!.href = <string>setting?.general?.favicon_image?.original_url;

        // Set site title
        this.titleService.setTitle(setting?.general?.site_title && setting?.general?.site_tagline ? 
          `${setting?.general?.site_title} | ${setting?.general?.site_tagline}` : 'FastKart Marketplace: Where Vendors Shine Together' )
      })

    // customize default values of navs used by this component tree
		config.destroyOnHide = false;
		config.roles = false;

    this.actions.pipe(ofActionDispatched(Logout)).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  
}

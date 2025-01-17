import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { NotificationService } from '../../shared/services/notification.service';
import { Values } from '../../shared/interface/setting.interface';
import { GetSettingOption } from '../../shared/action/setting.action';
import { SettingState } from '../../shared/state/setting.state';
import { GetThemeOption } from '../../shared/action/theme-option.action';
import { GetCurrencies } from '../../shared/action/currency.action';
import { AuthClear } from '../../shared/action/auth.action';
import { GetStates } from '../../shared/action/state.action';
import { GetCountries } from '../../shared/action/country.action';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  @Select(SettingState.setting) setting$: Observable<Values>;

  public isMaintenanceModeOn: boolean = false;

  constructor(private store: Store, private router: Router,
    private notificationService: NotificationService) {
    this.store.dispatch(new GetCountries());
    this.store.dispatch(new GetStates());
    this.store.dispatch(new GetSettingOption());
    this.store.dispatch(new GetThemeOption());
    this.store.dispatch(new GetCurrencies({ status: 1 }));
    this.setting$.subscribe(setting => {
      this.isMaintenanceModeOn = setting?.maintenance?.maintenance_mode!
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {

    // If Maintainance Mode On
    if(this.isMaintenanceModeOn) {
      this.router.navigate(['/maintenance']);
    }

    const token = this.store.selectSnapshot(state => state.auth.access_token);
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notificationService.notification = false;
          this.store.dispatch(new AuthClear());
        }
        return throwError(() => error);
      })
    );

  }
}

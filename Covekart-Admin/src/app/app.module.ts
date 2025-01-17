import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Component
import { AppComponent } from './app.component';

// State
import { LoaderState } from './shared/state/loader.state';
import { NotificationState } from './shared/state/notification.state';
import { AttachmentState } from './shared/state/attachment.state';
import { SettingState } from './shared/state/setting.state';
import { MenuState } from './shared/state/menu.state';
import { DashboardState } from './shared/state/dashboard.state';
import { AccountState } from './shared/state/account.state';
import { CountryState } from './shared/state/country.state';
import { StateState } from './shared/state/state.state';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgxsModule.forRoot([
      LoaderState,
      MenuState,
      NotificationState,
      DashboardState,
      AccountState,
      CountryState,
      StateState,
      SettingState,
      AttachmentState
    ]),
    NgxsStoragePluginModule.forRoot({
      key: [
        'auth',
        'dashboard',
        'notification',
        'account',
        'country',
        'state',
        'setting'
      ]
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
    }),
    SharedModule,
    CoreModule,
    LoadingBarRouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

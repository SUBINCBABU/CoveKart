import { Injectable, } from '@angular/core';
import { UrlTree, Router } from '@angular/router';
import { Observable, catchError, delay, map, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngxs/store';
import { GetUserDetails } from './../../shared/action/account.action';
import { GetNotification } from './../../shared/action/notification.action';
import { NavService } from './../../shared/services/nav.service';
import { GetBadges } from './../../shared/action/menu.action';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private store: Store, 
    private router: Router, private navService: NavService) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.store.selectSnapshot(state => state.auth && state.auth.access_token)) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    this.navService.sidebarLoading = true;

    this.store.dispatch(new GetBadges());
    this.store.dispatch(new GetNotification());
    this.store.dispatch(new GetUserDetails()).subscribe({
      complete: () => {
        this.navService.sidebarLoading = false;
      }
    });
    
    return true
  }

  canActivateChild(): Observable<boolean> {
    return this.checkAuthStatus().pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          // Delay the navigation by 1 second
          return of(true).pipe(
            delay(1000),
            tap(() => this.router.navigate(['/dashboard']))
          );
        }

        // User is not authenticated, allow access to child route
        return of(true);
      })
    );
  }

  private checkAuthStatus(): Observable<boolean> {
    return this.store.select(state => state.auth && state.auth.access_token).pipe(
      map(access_token => !!access_token), // Convert to boolean
      catchError(() => of(false)) // Handle errors, e.g., when access_token is not available
    );
  }

}

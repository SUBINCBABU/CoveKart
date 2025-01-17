import { Component, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from '../../.././../../shared/action/auth.action';
import { AccountUser } from '../../.././../../shared/interface/account.interface';
import { AccountState } from '../../.././../../shared/state/account.state';
import { ConfirmationModalComponent } from '../../../ui/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  @Select(AccountState.user) user$: Observable<AccountUser>;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
  
  public active: boolean = false;

  constructor(private store: Store) {
  }

  clickHeaderOnMobile(){
    this.active = !this.active
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}

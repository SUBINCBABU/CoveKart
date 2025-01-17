import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UpdatePassword } from '../../../shared/action/auth.action';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent {

  public form: FormGroup;
  public email: string;
  public token: any;
  public breadcrumb: Breadcrumb = {
    title: "Reset Password",
    items: [{ label: 'Reset Password', active: true }]
  }

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    public  router: Router
  ) {
    this.email = this.store.selectSnapshot(state => state.auth.email);
    this.token = this.store.selectSnapshot(state => state.auth.token);
    this.form = this.formBuilder.group({
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }
 errorMessage=""
  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(
          new UpdatePassword({
            email: this.email,
            token: this.token,
            password: this.form.value.newPassword,
            password_confirmation: this.form.value.confirmPassword,
          })
      ).subscribe(
        {
          complete: () => { 
            this.router.navigateByUrl('/auth/login'); 
          } ,
          error: (err) => {
            // Set an error message to display in the template
            this.errorMessage = 'invalid otp';
            console.error('Registration error:', err); // For debugging purposes
          }    
        }
      );
    }
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { VerifyEmailOtp } from '../../../shared/action/auth.action';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {

  public form: FormGroup;
  public email: string;
  public breadcrumb: Breadcrumb = {
    title: "OTP",
    items: [{ label: 'OTP', active: true }]
  }

  constructor(
    public router: Router, 
    public store: Store, 
    public formBuilder: FormBuilder
  ) {
    this.email = this.store.selectSnapshot(state => state.auth.email);
    this.form = this.formBuilder.group({
      otp: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }
   errorMessage=""
  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new VerifyEmailOtp({ 
        email: this.email, 
        token: this.form.value.otp
      })).subscribe(
        {
          complete: () => { 
            this.router.navigateByUrl('/auth/update-password'); 
          },
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


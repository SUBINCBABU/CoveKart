import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { CreateRole, EditRole, UpdateRole } from '../../../shared/action/role.action';
import { RoleState } from '../../../shared/state/role.state';

@Component({
  selector: 'app-form-role',
  templateUrl: './form-role.component.html',
  styleUrls: ['./form-role.component.scss']
})
export class FormRoleComponent {

  @Input() type: String;

  public form: FormGroup;
  public permissions: number[] = [];
  public id: number;
  
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      permissions: new FormControl('', [Validators.required])
    });
  }

  get permissionControl(): FormArray {
    return this.form.get("permissions") as FormArray;
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditRole(params['id']))
                      .pipe(mergeMap(() => this.store.select(RoleState.selectedRole)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(role => {
        this.id = role?.id!;
        let permissions  = role?.permissions!.map(permission => permission?.id);
        this.permissions = permissions!;
        this.form.patchValue({
          name: role?.name,
          permissions: permissions
        });
      });
  }

  setPermissions(permissions: number[]) {
    if(Array.isArray(permissions)) {
      this.form.controls['permissions'].setValue(permissions);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateRole(this.form.value);
    
    if(this.type == 'edit' && this.id) {
      action = new UpdateRole(this.form.value, this.id)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/role'); 
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

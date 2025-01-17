import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { CreateTax, EditTax, UpdateTax } from '../../../shared/action/tax.action';
import { TaxState } from '../../../shared/state/tax.state';

@Component({
  selector: 'app-form-tax',
  templateUrl: './form-tax.component.html',
  styleUrls: ['./form-tax.component.scss']
})
export class FormTaxComponent {

  @Input() type: string;

  public id: number;
  public form: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required]),
      status: new FormControl(1)
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditTax(params['id']))
                      .pipe(mergeMap(() => this.store.select(TaxState.selectedTax)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(tax => {
        this.id = tax?.id!;
        this.form.patchValue({
          name: tax?.name,
          rate: tax?.rate,
          status: tax?.status
        });
      });
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateTax(this.form.value);
    
    if(this.type == 'edit' && this.id) {
      action = new UpdateTax(this.form.value, this.id);
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/tax'); 
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}

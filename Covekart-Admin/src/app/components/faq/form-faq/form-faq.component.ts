import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { mergeMap, of, Subject, switchMap, takeUntil } from 'rxjs';
import { CreateFaq, EditFaq, UpdateFaq } from '../../../shared/action/faq.action';
import { Faq } from '../../../shared/interface/faq.interface';
import { FaqState } from '../../../shared/state/faq.state';

@Component({
  selector: 'app-form-faq',
  templateUrl: './form-faq.component.html',
  styleUrls: ['./form-faq.component.scss']
})
export class FormFaqComponent {
  @Input() type: string;

  public form: FormGroup;
  public faq: Faq | null;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { 
      this.form = this.formBuilder.group({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(true)
      });
  }
  
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditFaq(params['id']))
                      .pipe(mergeMap(() => this.store.select(FaqState.selectedFaq)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(faq => {
        this.faq = faq;
        this.form.patchValue({
          title: this.faq?.title,
          description: this.faq?.description,
          status: this.faq?.status
        });
      });
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateFaq(this.form.value);
    
    if(this.type == 'edit' && this.faq?.id) {
      action = new UpdateFaq(this.form.value, this.faq.id)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
            this.router.navigateByUrl('/faq'); 
        }
      });
    }
  }

}

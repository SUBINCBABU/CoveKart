import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { CreateCategory, EditCategory, UpdateCategory } from '../../../shared/action/category.action';
import { Category } from '../../../shared/interface/category.interface';
import { CategoryState } from '../../../shared/state/category.state';
import { Attachment } from '../../../shared/interface/attachment.interface';
              
@Component({
  selector: 'app-form-category',
  templateUrl: './form-category.component.html',
  styleUrls: ['./form-category.component.scss']
})
export class FormCategoryComponent {

  @Input() type: string;
  @Input() categories: Category[];
  @Input() categoryType: string | null = 'product';

  public form: FormGroup;
  public category: Category;
  public id: number;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { 
      this.form = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(),
        parent_id: new FormControl(),
        type: new FormControl(this.categoryType, []),
        commission_rate: new FormControl(),
        category_image_id: new FormControl(),
        category_icon_id: new FormControl(),
        status: new FormControl(true)
      });
  }

  ngOnChanges() {
    this.form.controls['type'].setValue(this.categoryType);
  }

  ngOnInit() {
   
    this.route.params
   
    
  
    
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditCategory(params['id']))
                      .pipe(mergeMap(() => this.store.select(CategoryState.selectedCategory)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(category => {
      
        
        this.category = category!;
        this.form.patchValue({
          name: this.category?.name,
          description: this.category?.description,
          parent_id: this.category?.parent_id,
          type: this.category?.type,
          commission_rate: this.category?.commission_rate,
          category_image_id: this.category?.category_image_id,
          category_icon_id: this.category?.category_icon_id,
          status: this.category?.status
        });
      });
  }

  selectItem(data: number[]) {
    if(Array.isArray(data) && data.length) {
      this.form.controls['parent_id'].setValue(data[0]);
    } else {
      this.form.controls['parent_id'].setValue('');
    }
  }

  selectCategoryImage(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['category_image_id'].setValue(data ? data.id : '');
    }
  }

  selectCategoryIcon(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['category_icon_id'].setValue(data ? data.id : '');
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateCategory(this.form.value);
    
    if(this.type == 'edit' && this.category?.id) {
      action = new UpdateCategory(this.form.value, this.category.id)
     
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          if(this.type == 'create'){
            this.form.reset();
            this.form.controls['category_image_id'].setValue('');
            this.form.controls['category_icon_id'].setValue('');
            this.form.controls['status'].setValue(true);
          }else {
            if(this.form.value.type === 'product'){
              this.router.navigateByUrl('/category');
            }else {
              this.router.navigateByUrl('/blog/category');
            }
          }
          window.location.reload();
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}



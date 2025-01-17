import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { Editor } from 'ngx-editor';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { Attachment } from '../../../shared/interface/attachment.interface';
import { CategoryModel } from '../../../shared/interface/category.interface';
import { GetTags } from '../../../shared/action/tag.action';
import { GetCategories } from '../../../shared/action/category.action';
import { CreateBlog, EditBlog, UpdateBlog } from '../../../shared/action/blog.action';
import { Blog } from '../../../shared/interface/blog.interface';
import { TagModel } from '../../../shared/interface/tag.interface';
import { BlogState } from '../../../shared/state/blog.state';
import { CategoryState } from '../../../shared/state/category.state';
import { TagState } from '../../../shared/state/tag.state';

@Component({
  selector: 'app-form-blog',
  templateUrl: './form-blog.component.html',
  styleUrls: ['./form-blog.component.scss']
})
export class FormBlogComponent {

  @Input() type: string;

  @Select(BlogState.selectedBlog) blog$: Observable<Blog>;
  @Select(CategoryState.category) category$: Observable<CategoryModel>;
  @Select(TagState.tag) tag$: Observable<TagModel>;

  public form: FormGroup;
  public id: number;
  public selectedCategories: number[] = [];
  public selectedTags: number[] = [];
  public html = '';
  public editor: Editor
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.store.dispatch(new GetCategories({type: 'post'}));
    this.store.dispatch(new GetTags({type: 'post'}));
    this.form = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(),
      content: new FormControl(),
      meta_title: new FormControl(),
      meta_description: new FormControl(),
      blog_meta_image_id: new FormControl(),
      blog_thumbnail_id: new FormControl('', [Validators.required]),
      categories: new FormControl('', [Validators.required]),
      tags: new FormControl(),
      is_featured: new FormControl(0),
      is_sticky: new FormControl(0),
      status: new FormControl(1),
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditBlog(params['id']))
                      .pipe(mergeMap(() => this.store.select(BlogState.selectedBlog)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(blog => {
        this.id = blog?.id!;
        this.selectedCategories = blog?.categories.map(value => value?.id!)!;
        this.selectedTags = blog?.tags.map(value => value?.id!)!;
        this.form.patchValue({
          title: blog?.title,
          description: blog?.description,
          content: blog?.content,
          blog_thumbnail_id: blog?.blog_thumbnail_id,
          categories: this.selectedCategories,
          tags: this.selectedTags,
          meta_title: blog?.meta_title,
          meta_description: blog?.meta_description,
          is_featured: blog?.is_featured,
          is_sticky: blog?.is_sticky,
          status: blog?.status
        });
      });

      this.editor = new Editor();
  }

  selectThumbnail(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['blog_thumbnail_id'].setValue(data ? data.id : '');
    }
  }

  selectMetaImage(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['blog_meta_image_id'].setValue(data ? data.id : null);
    }
  }

  selectCategoryItem(data: number[]) {
    if(Array.isArray(data)) {
      this.form.controls['categories'].setValue(data);
    }
  }

  selectTagItem(data: number[]) {
    if(Array.isArray(data)) {
      this.form.controls['tags'].setValue(data);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateBlog(this.form.value);

    if(this.type == 'edit' && this.id) {
      action = new UpdateBlog(this.form.value, this.id)
    }

    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { this.router.navigateByUrl('/blog'); }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

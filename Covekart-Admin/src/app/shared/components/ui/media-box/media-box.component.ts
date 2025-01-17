import { Component, Inject, ViewChild, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { Params } from '../../../../shared/interface/core.interface';
import { AttachmentState } from '../../../state/attachment.state';
import { GetAttachments, DeleteAttachment } from '../../../action/attachment.action';
import { DeleteModalComponent } from "../../../../shared/components/ui/modal/delete-modal/delete-modal.component";
import { Attachment, AttachmentModel } from '../../../../shared/interface/attachment.interface';
import { image } from 'ngx-editor/schema/nodes';

@Component({
  selector: 'app-media-box',
  templateUrl: './media-box.component.html',
  styleUrls: ['./media-box.component.scss']
})
export class MediaBoxComponent {

  @Select(AttachmentState.attachment) attachment$: Observable<AttachmentModel>;

  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  @Input() selectedImages: Attachment[] = [];
  @Input() multiple: boolean = false;
  @Input() url: boolean = false;
  @Input() loading: boolean = true;
  @Input() deleteAction: boolean = true;

  @Output() setImage: EventEmitter<[] | any> = new EventEmitter();
  @Output() setDeleteImage: EventEmitter<[] | any> = new EventEmitter();

  public term = new FormControl();
  public filter = {
    'search': '',
    'field': '', 
    'sort': '', // current Sorting Order
    'page': 1, // current page number
    'paginate': 48, // Display per page,
  };
  public totalItems: number = 0;

  constructor(private store: Store,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
    this.attachment$.subscribe(attachment => this.totalItems = attachment?.total);
    this.getAttachments(this.filter, true);
    this.term.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(
        (data: string) => {
        this.filter.search = data;
        this.getAttachments(this.filter);
    });
  }

  getAttachments(filter: Params, loader?: boolean) {
  
    this.loading = true; 
    this.store.dispatch(new GetAttachments(filter)).subscribe({
      
      
      complete: () => { 
        
        this.loading = false; 
      }
    });
    if(!loader)
      this.renderer.addClass(this.document.body, 'loader-none');
  }

  onMediaChange(event: Event) {
    this.filter.sort = (<HTMLInputElement>event.target).value;
    this.getAttachments(this.filter)
  }

  onActionClicked(action: string, data: Attachment) {
    if(action == 'delete')
      this.store.dispatch(new DeleteAttachment(data.id!)).subscribe({
        complete: () =>{
          this.setDeleteImage.emit(data.id!)
        }
      })
  }

  selectImage(event: Event, attachment: Attachment, url: boolean) {
    if(this.multiple) {
     
      const index = this.selectedImages.indexOf(attachment);
      if((<HTMLInputElement>event.target).checked) { 
        if(index == -1) this.selectedImages.push(attachment) 
      } else {
        this.selectedImages = this.selectedImages.filter(image => image.id != parseInt((<HTMLInputElement>event.target).value));
      }
    } else {
      this.selectedImages = <any>attachment;
    }

    if(url) {
      this.selectedImages = <any>attachment;
    }
    this.setImage.emit(this.selectedImages);
  }

  setPaginate(data: number) {
    this.filter.page = data;
    this.getAttachments(this.filter);
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }

}

import { Component, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Store } from '@ngxs/store';
import { CreateAttachment } from '../../../../action/attachment.action';
import { Attachment } from '../../../../interface/attachment.interface';
import { NotificationService } from '../../../../../shared/services/notification.service';

@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.component.html',
  styleUrls: ['./media-modal.component.scss']
})
export class MediaModalComponent {
  
  public active = 'select';
  public closeResult: string;
  public modalOpen: boolean = false;

  public media: Attachment;
  public files: File[] = [];

  @Input() selectMedia: boolean = true;
  @Input() multipleImage: boolean = false;
  @Input() url: boolean = false;

  @ViewChild("mediaModal", { static: false }) MediaModal: TemplateRef<string>;

  @Output() selectImage: EventEmitter<Attachment> = new EventEmitter();

  constructor(private store: Store, 
    private notificationService: NotificationService,
    private modalService: NgbModal) { 
  }

  async openModal() {
    this.modalOpen = true;
    if(this.selectMedia)
      this.active = 'select';
    else
      this.active = 'upload';
    this.modalService.open(this.MediaModal, {
      ariaLabelledBy: 'Media-Modal',
      centered: true,
      windowClass: 'theme-modal modal-xl media-modal'
    }).result.then((result) => {
      `Result ${result}`
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if(this.selectMedia)
      this.active = 'select';
    else
      this.active = 'upload';
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    if((this.files.length + event.addedFiles.length) <= 5){
      this.files.push(...event.addedFiles);
    } else this.notificationService.showError(`You've reached 5 file maximum.`);
  }
  
  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  addMedia(nav: NgbNav) {
    if(this.files.length) {
      if(this.active == 'upload') {
        this.store.dispatch(new CreateAttachment(this.files)).subscribe({
          complete: () => {
            this.files = [];
            if(this.selectMedia) {
              nav.select('select');
            } else {
              this.modalService.dismissAll();
            }
          }
        })
      } 
    }
  }

  setImage(data: Attachment) {
    this.media = data;
  }

  selectedMedia(modal: NgbModalRef) {
    this.selectImage.emit(this.media);
    modal.dismiss('close');
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}

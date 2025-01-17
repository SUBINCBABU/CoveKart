import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MediaModalComponent } from "../../ui/modal/media-modal/media-modal.component";
import { Attachment } from '../../../interface/attachment.interface';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {

  @ViewChild("mediaModal") MediaModal: MediaModalComponent;

  @Input() images: Attachment[] = [];
  @Input() image: Attachment | null;
  @Input() id: string;
  @Input() imageUrl: string | null;
  @Input() url: boolean = false;
  @Input() multipleImage: boolean = false;
  @Input() helpText: string;

  @Output() selectedFiles: EventEmitter<any> = new EventEmitter();

  public showImages: Attachment[] = [];
  public showImage: Attachment | null;
  public showImageUrl: String | null;

  ngOnChanges() {
   
    this.showImage = this.image;
    this.showImages = this.images;
    this.showImageUrl = this.imageUrl;
  }

  selectImage(data: Attachment, url: boolean) {
    if(Array.isArray(data)) {
      this.images = data;
      this.showImages = data;
    } else if(url) {
      this.imageUrl = data.original_url;
      this.showImageUrl = data.original_url;
    } else {
     
      this.image = data;
      this.showImage = data;
    }
    if(this.imageUrl) {
      this.selectedFiles.emit(this.imageUrl);
    } else {
      this.selectedFiles.emit(this.images.length ? this.images : this.image);
    }
  }
  //original_url
  remove(index: number, type: string) {
    if(type == 'multiple' && Array.isArray(this.images)) {
      this.images.splice(index, 1);
      this.showImages = this.images;
    } else if(type == 'single_image_url') {
      this.imageUrl = null;
      this.showImageUrl = null;
      this.image = null;
    } else {
      this.image = null;
      this.showImage = null;
    }
    this.selectedFiles.emit(this.images.length ? this.images : this.image);
  }

}

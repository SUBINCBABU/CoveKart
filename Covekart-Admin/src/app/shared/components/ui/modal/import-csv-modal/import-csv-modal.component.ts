import { Component, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Store } from '@ngxs/store';
import { ImportUser } from '../../../../action/user.action';

@Component({
  selector: 'app-import-csv-modal',
  templateUrl: './import-csv-modal.component.html',
  styleUrls: ['./import-csv-modal.component.scss']
})
export class ImportCsvModalComponent {

  public active = 'upload';
  public closeResult: string;
  public modalOpen: boolean = false;

  public files: File[] = [];

  @Input() module: string;

  @ViewChild("csvModal", { static: false }) CSVModal: TemplateRef<string>;

  constructor(private store: Store, 
    private modalService: NgbModal) { 
  }

  async openModal() {
    this.modalOpen = true;
    this.modalService.open(this.CSVModal, {
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
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  upload() {
    if(this.files.length && this.module) {
      if(this.module == 'user') {
        this.store.dispatch(new ImportUser(this.files)).subscribe({
          complete: () => {
            this.files = [];
            this.modalService.dismissAll();
          }
        })
      } 
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}

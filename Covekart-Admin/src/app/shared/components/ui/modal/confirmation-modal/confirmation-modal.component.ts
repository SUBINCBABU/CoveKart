import { Component, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableClickedAction } from '../../../../interface/table.interface';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  public closeResult: string;
  public modalOpen: boolean = false;
  public userAction: TableClickedAction;

  @ViewChild("confirmationModal", { static: false }) ConfirmationModal: TemplateRef<any>;

  @Output() confirmed: EventEmitter<TableClickedAction> = new EventEmitter();

  constructor(private modalService: NgbModal) { }

  async openModal(action: string, data?: any, value?: any) {
    this.modalOpen = true;
    this.userAction = {
      actionToPerform: action,
      data: data,
      value: value
    };
    this.modalService.open(this.ConfirmationModal, {
      ariaLabelledBy: 'Confirmation-Modal',
      centered: true,
      windowClass: 'theme-modal text-center'
    }).result.then((result) => {
      `Result ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  confirm() {
    this.confirmed.emit(this.userAction);
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}

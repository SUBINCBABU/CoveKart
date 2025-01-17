import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shipping-rule-modal',
  templateUrl: './shipping-rule-modal.component.html',
  styleUrls: ['./shipping-rule-modal.component.scss']
})
export class ShippingRuleModalComponent {

  public closeResult: string;
  public modalOpen: boolean = false;

  @ViewChild("createShippingRuleModal", { static: false }) CreateShippingRuleModal: TemplateRef<string>;

  constructor(private modalService: NgbModal) { }

  async openModal() {
    this.modalOpen = true;
    this.modalService.open(this.CreateShippingRuleModal, {
      ariaLabelledBy: 'shipping-rule-Modal',
      centered: true,
      windowClass: 'theme-modal shipping-rule-modal modal-lg'
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

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}

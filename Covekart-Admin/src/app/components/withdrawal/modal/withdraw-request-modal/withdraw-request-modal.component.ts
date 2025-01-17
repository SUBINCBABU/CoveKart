import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { Store } from '@ngxs/store';
import { WithdrawRequest } from '../../../../shared/action/withdrawal.action';

@Component({
  selector: 'app-withdraw-request-modal',
  templateUrl: './withdraw-request-modal.component.html',
  styleUrls: ['./withdraw-request-modal.component.scss']
})
export class WithdrawRequestModalComponent {
  public modalOpen: boolean = false;
  public closeResult: string;
  public active = 'upload';
  public form: FormGroup;
  public payment_type : Select2Data = [
    {
      value: 'bank',
      label: 'Bank',
    },
    {
      value: 'paypal',
      label: 'Paypal',
    }
  ]

  @ViewChild("requestModal", { static: false }) RequestModal: TemplateRef<string>;

  constructor( private modalService: NgbModal, 
    private formBuilder: FormBuilder,
    private store: Store) { 
    this.form = this.formBuilder.group({
      amount: new FormControl('', [Validators.required]),
      payment_type: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
  }

  async openModal() {
    this.modalOpen = true;
    this.modalService.open(this.RequestModal, {
      ariaLabelledBy: 'Payout-Modal',
      centered: true,
      windowClass: 'theme-modal'
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

  sendRequest(){
    if(this.form.valid){
      this.store.dispatch(new WithdrawRequest(this.form.value))
    }
  }
}

import { Component, TemplateRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { Select2Data } from 'ng-select2-component';
import { SendRefundRequest } from '../../../../../shared/action/refund.action';
import { Product } from '../../../../../shared/interface/product.interface';

@Component({
  selector: 'app-refund-modal',
  templateUrl: './refund-modal.component.html',
  styleUrls: ['./refund-modal.component.scss']
})
export class RefundModalComponent {

  @ViewChild("refundModal", { static: false }) RefundModal: TemplateRef<string>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public product: Product;
  public form: FormGroup;

  public option: Select2Data = [
    {
      label: 'Wallet',
      value: 'wallet',
    },
    {
      label: 'Paypal',
      value: 'paypal',
    }
  ]

  constructor( private modalService: NgbModal, private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object ){
    this.form = new FormGroup({
      reason: new FormControl('', [Validators.required]),
      payment_type: new FormControl('', [Validators.required]),
      product_id: new FormControl()
    })
  }

  async openModal(product: Product) {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.product = product;
      this.form.get('product_id')?.patchValue(product.id);
      this.modalOpen = true;
      this.modalService.open(this.RefundModal, {
        ariaLabelledBy: 'profile-Modal',
        centered: true,
        windowClass: 'theme-modal'
      }).result.then((result) => {
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
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

  sendRequest(){
    this.form.markAllAsTouched();
    if(this.form.valid){
      this.store.dispatch(new SendRefundRequest(this.form.value)).subscribe({
        complete: () => {
          this.form.reset();
          this.modalService.dismissAll();
        }
      });
    }
  }
}

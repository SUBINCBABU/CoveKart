import { Component, TemplateRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Option } from '../../../../../shared/interface/theme-option.interface';
import { ThemeOptionState } from '../../../../../shared/state/theme-option.state';

@Component({
  selector: 'app-delivery-return-modal',
  templateUrl: './delivery-return-modal.component.html',
  styleUrls: ['./delivery-return-modal.component.scss']
})
export class DeliveryReturnModalComponent {

  @ViewChild("deliveryReturnModal", { static: false }) DeliveryReturnModal: TemplateRef<string>;

  @Select(ThemeOptionState.themeOptions) themeOptions$: Observable<Option>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public policy: string;

  constructor( private modalService: NgbModal, @Inject(PLATFORM_ID) private platformId: Object){}

  async openModal(value: string) {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.policy = value;
      this.modalOpen = true;
      this.modalService.open(this.DeliveryReturnModal, {
        ariaLabelledBy: 'profile-Modal',
        centered: true,
        windowClass: 'theme-modal modal-lg'
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
}

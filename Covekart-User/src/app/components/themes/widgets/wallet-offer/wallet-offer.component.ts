import { Component, Input } from '@angular/core';
import * as data from '../../../../shared/data/owl-carousel';
import { Offer } from '../../../../shared/interface/theme.interface';

@Component({
  selector: 'app-wallet-offer',
  templateUrl: './wallet-offer.component.html',
  styleUrls: ['./wallet-offer.component.scss']
})
export class WalletOfferComponent {

  @Input() offers: Offer[];

  public customOptionsItem3 = data.customOptionsItem3;

  copyFunction(txt:string){
    navigator.clipboard.writeText(txt);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserAddress } from '../../../../shared/interface/user.interface';

@Component({
  selector: 'app-address-block',
  templateUrl: './address-block.component.html',
  styleUrls: ['./address-block.component.scss']
})
export class AddressBlockComponent {

  @Input() addresses: UserAddress[] = [];
  @Input() type: string = 'shipping';

  @Output() selectAddress: EventEmitter<number> = new EventEmitter();

  constructor() { }

  set(event: Event) {
    this.selectAddress.emit(+(<HTMLInputElement>event.target)?.value);
  }

}

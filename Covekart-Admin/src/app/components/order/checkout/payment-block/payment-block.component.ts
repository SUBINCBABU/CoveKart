import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-block',
  templateUrl: './payment-block.component.html',
  styleUrls: ['./payment-block.component.scss']
})
export class PaymentBlockComponent {

  @Output() selectPaymentMethod: EventEmitter<string> = new EventEmitter();

  constructor() { }

  set(value: string) {
    this.selectPaymentMethod.emit(value);
  }

}

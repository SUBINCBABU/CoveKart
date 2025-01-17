import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.scss']
})
export class Error403Component {

  constructor(private location: Location) {}

  back() {
    this.location.back();
  }
  
}

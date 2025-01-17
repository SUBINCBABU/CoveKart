import { Component } from '@angular/core';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.scss']
})
export class ModeComponent {

  customizeLayoutDark() {
    document.body.classList.toggle('dark-only');
  }
}

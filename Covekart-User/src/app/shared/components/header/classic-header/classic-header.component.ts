import { Component, Input, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Option } from '../../../interface/theme-option.interface';

@Component({
  selector: 'app-classic-header',
  templateUrl: './classic-header.component.html',
  styleUrls: ['./classic-header.component.scss']
})
export class ClassicHeaderComponent {

  @Input() data: Option | null;
  @Input() logo: string | null | undefined;
  @Input() sticky: boolean | number | undefined; // Default false

  public stick: boolean = false;
  public active: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (number >= 150 && window.innerWidth > 400) {
        this.stick = true;
      } else {
        this.stick = false;
      }
    }
  }

  toggle(val: boolean){
    this.active = val;
  }
}

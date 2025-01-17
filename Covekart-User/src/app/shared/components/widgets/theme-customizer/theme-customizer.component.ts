import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Option } from '../../../interface/theme-option.interface';
import { ThemeOptionState } from '../../../../shared/state/theme-option.state';
import { ThemeOptionService } from 'src/app/shared/services/theme-option.service';

@Component({
  selector: 'app-theme-customizer',
  templateUrl: './theme-customizer.component.html',
  styleUrls: ['./theme-customizer.component.scss']
})
export class ThemeCustomizerComponent {

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;

  public open: boolean = false;
  public show: boolean = false;
  public mode: string;
  public value: string;
  public primary_color: string;

  constructor(public themeOptionService: ThemeOptionService,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.themeOption$.subscribe(option => {
      this.mode = option?.general ? option?.general?.mode : 'light';
      this.value = option?.general ? option?.general?.language_direction : 'ltr';
    })
  }

  toggle(){
    this.open = !this.open;
  }

  layout(value: string){
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.value = value;
      if(value === 'rtl'){
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    }
  }

  layoutMode(value: string){
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.mode = value;
      if(this.mode === 'dark'){
        document.getElementsByTagName('html')[0].classList.add('dark')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('dark')
      }
    }
  }

  customizeThemeColor(event: any){
    if (isPlatformBrowser(this.platformId)) { // For SSR 
     document.documentElement.style.setProperty('--theme-color', event.target.value);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      // Remove Color
      document.documentElement.style.removeProperty('--theme-color');
    }
  }

  closeDropdown(){
    this.open = false;
  }
}

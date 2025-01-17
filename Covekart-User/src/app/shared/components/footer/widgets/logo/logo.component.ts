import { Component, Input } from '@angular/core';
import { Option } from '../../../../../shared/interface/theme-option.interface';
import { Footer } from '../../../../../shared/interface/theme.interface';

@Component({
  selector: 'app-footer-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class FooterLogoComponent {

  @Input() data: Option;
  @Input() footer: Footer;

}

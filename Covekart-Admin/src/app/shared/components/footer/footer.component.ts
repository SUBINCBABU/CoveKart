import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SettingState } from '../../state/setting.state';
import { Values } from '../../interface/setting.interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Select(SettingState.setting) setting$: Observable<Values>;

}

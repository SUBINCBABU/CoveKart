import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoaderState } from '../../state/loader.state';

@Component({
  selector: 'app-page-wrapper',
  templateUrl: './page-wrapper.component.html',
  styleUrls: ['./page-wrapper.component.scss']
})
export class PageWrapperComponent {

  @Input() public title: string;
  @Input() public grid: boolean = true;
  @Input() public gridClass: string = 'col-xxl-8 col-xl-10 m-auto';

  @Select(LoaderState.status) public loadingStatus$: Observable<boolean>;

}

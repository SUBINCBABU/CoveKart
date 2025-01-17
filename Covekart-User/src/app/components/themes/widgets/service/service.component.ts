import { Component, Input } from '@angular/core';
import { Services } from '../../../../shared/interface/theme.interface';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {

  @Input() data: Services[];

}

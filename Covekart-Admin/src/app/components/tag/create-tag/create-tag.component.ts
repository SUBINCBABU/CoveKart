import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss']
})
export class CreateTagComponent {

  @Input() tagType: string | null = 'product';

}

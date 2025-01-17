import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent {

  @Input() tagType: string | null = 'product';

}

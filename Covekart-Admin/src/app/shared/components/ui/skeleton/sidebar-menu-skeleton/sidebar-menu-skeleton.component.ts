import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu-skeleton',
  templateUrl: './sidebar-menu-skeleton.component.html',
  styleUrls: ['./sidebar-menu-skeleton.component.scss']
})
export class SidebarMenuSkeletonComponent {

  @Input() loading: boolean = false;
  
  public skeletonItems = Array.from({ length: 20 }, (_, index) => index);

}

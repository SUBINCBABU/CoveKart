import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MobileMenu } from '../../../../../shared/interface/menu.interface';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent {

  public menuItem: MobileMenu[] = [
    {
      id: 1,
      active: true,
      title: 'Home',
      icon: 'ri-home-2',
      path: '/'
    },
    {
      id: 2,
      active: false,
      title: 'Category',
      icon: 'ri-apps-line js',
      path: '/collections'
    },
    {
      id: 3,
      active: false,
      title: 'Search',
      icon: 'ri-search-2',
      path: '/search'
    },
    {
      id: 4,
      active: false,
      title: 'My Wish',
      icon: 'ri-heart-3',
      path: '/wishlist'
    },
    {
      id: 5,
      active: false,
      title: 'Cart',
      icon: 'fly-cate ri-shopping-bag',
      path: '/cart'
    }
  ]

  constructor(private router: Router){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuItem?.forEach((menu: MobileMenu) => {
          menu.active = false;
          if((event.url.split("?")[0].toString()) === menu.path){
            menu.active = true;
          }
        })
      }
    })

  }

  activeMenu(menu: MobileMenu){
    this.menuItem.forEach(item => {
      this.menuItem.includes(menu)
      item.active  = false;
    })
    menu.active = !menu.active
  }
}

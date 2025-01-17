import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Menu } from '../../../../../shared/interface/menu.interface';
import { NavService } from '../../../../../shared/services/nav.service';
import * as data from '../../../../../shared/data/menu'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  
  public menuItems: Menu[];
  public items: Menu[] = data.menu;

  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string;
  public open = false

  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('dropdownContainer', { static: false }) dropdownContainer: ElementRef;
  constructor(public navServices: NavService, private renderer: Renderer2) {
  }

  ngOnInit() { }

  closeSearch() {
    this.navServices.search = false;
  }

  openDropDown(text: string) {
    text && (this.searchResult = !this.searchResult);
    var element = document.getElementsByTagName("body")[0]
    element.classList.toggle("overlay-search");
  }

  searchTerm(term?: string)  {
    // if (!term) return (this.menuItems = []);
    if(term){
      this.addFix()
      let items: Menu[] = [];
      term = term.toLowerCase();
      this.items.filter((menuItems) => {
        if (!menuItems?.title) return false;
  
        if (menuItems.title.toLowerCase().includes(term!) && menuItems.type === "link") {
          items.push(menuItems);
        }
        if (!menuItems.children) return false;
        menuItems.children.filter((subItems) => {
          if (subItems?.title.toLowerCase().includes(term!) && subItems.type === "link") {
            subItems.icon = menuItems.icon;
            items.push(subItems);
          }
          if (!subItems.children) return false;
          subItems.children.filter((suSubItems) => {
            if (suSubItems.title.toLowerCase().includes(term!)) {
              suSubItems.icon = menuItems.icon;
              items.push(suSubItems);
            }
          });
          return items
        });
        return (this.checkSearchResultEmpty(items),this.menuItems = items)
      });
    }else {
      this.removeFix();
      return this.menuItems = []
    }
    return this.menuItems;
  }
  
  
  checkSearchResultEmpty(items: Menu[]) {
    if (!items.length) this.searchResultEmpty = true;
    else this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
    document.getElementsByTagName("body")[0].classList.add("overlay-search");
  }

  removeFix() {
    this.searchResult = false;
    this.text = "";
    document.getElementsByTagName("body")[0].classList.remove("overlay-search");
  }

  clickOutside(): void {
    this.searchResult = false
  }
}

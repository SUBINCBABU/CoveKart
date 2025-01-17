import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

export interface Language {
  language: string;
  code: string;
  icon: string;
}

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent {

  public active: boolean = false;
  public languages: Language[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us'
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr'
    },
  ]

  public selectedLanguage: Language = {
    language: 'English',
    code: 'en',
    icon: 'us'
  }

  constructor(private translate: TranslateService) {
    let language = localStorage.getItem("language");

    if(language == null){
      this.translate.use(this.selectedLanguage.code);
    }else{
      this.selectedLanguage = JSON.parse(language);
      this.translate.use(this.selectedLanguage.code);
    }
  }

  selectLanguage(language: any){
    this.active = false;
    this.translate.use(language.code);
    this.selectedLanguage = language;
    localStorage.setItem("language", JSON.stringify(this.selectedLanguage));
  }

  clickHeaderOnMobile(){
    this.active = !this.active
  }

  hideDropdown(){
    this.active = false;
  }

}

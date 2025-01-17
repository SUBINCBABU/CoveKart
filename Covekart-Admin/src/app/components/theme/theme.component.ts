import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from "../../shared/components/ui/modal/confirmation-modal/confirmation-modal.component";
import { GetThemes, UpdateTheme } from '../../shared/action/theme.action';
import { Themes, ThemesModel } from '../../shared/interface/theme.interface';
import { ThemeState } from '../../shared/state/theme.state';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})

export class ThemeComponent {

  public themes: Themes[]
  public selectedTheme: number | null;

  @Select(ThemeState.themes) themes$: Observable<ThemesModel>;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
 
    
    this.store.dispatch(new GetThemes())
    this.themes$.subscribe(item => {
      item?.data?.map((data:Themes)=> {
        if(data.status === 1) this.selectedTheme = data.id;
      })
    })
  }

  themeRoute(route: string) {
    this.router.navigateByUrl(`/theme/${route}`)
  }

  activeTheme(theme: any) {
    this.selectedTheme = null;
    this.selectedTheme = theme.data.id!;
    this.store.dispatch(new UpdateTheme(theme.data.id, 1));
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ThemeRoutingModule } from './theme-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { ThemeComponent } from './theme.component';
import { ParisComponent } from './paris/paris.component';
import { TokyoComponent } from './tokyo/tokyo.component';
import { OsakaComponent } from './osaka/osaka.component';
import { RomeComponent } from './rome/rome.component';
import { MadridComponent } from './madrid/madrid.component';
import { BerlinComponent } from './berlin/berlin.component';
import { DenverComponent } from './denver/denver.component';

// State
import { BlogState } from '../../shared/state/blog.state';
import { ThemeState } from '../../shared/state/theme.state';
import { CategoryState } from '../../shared/state/category.state';
import { ProductState } from '../../shared/state/product.state';

@NgModule({
  declarations: [
    ThemeComponent,
    ParisComponent,
    TokyoComponent,
    OsakaComponent,
    RomeComponent,
    MadridComponent,
    BerlinComponent,
     DenverComponent
  ],
  imports: [
    CommonModule,
    ThemeRoutingModule,
    NgxsModule.forFeature([
      BlogState, 
      ThemeState, 
      CategoryState,
      ProductState
    ]),
    SharedModule
  ]
})
export class ThemeModule { }

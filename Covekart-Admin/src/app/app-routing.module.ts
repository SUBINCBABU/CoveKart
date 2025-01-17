import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { content } from "./shared/routes/routes";
import { AuthGuard } from "./core/guard/auth.guard";
import { full } from "./shared/routes/full.routes";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { Error404Component } from "./errors/error404/error404.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./components/auth/auth.module").then((m) => m.AuthModule)
  },
  {
    path: "",
    component: ContentComponent,
    children: content
  },
  {
    path: '',
    component: FullComponent,
    children: full
  },
  { 
    path: '**', 
    pathMatch: 'full', 
    component: Error404Component 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabledBlocking",
      scrollPositionRestoration: 'enabled' ,
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

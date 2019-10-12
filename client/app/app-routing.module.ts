import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'login',
    loadChildren: './auth/auth.module#AuthModule',
    data: { showHeader: false, showSidebar: false }
  },
  { path: 'home', loadChildren: './modules/modules.module#ModulesModule'},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

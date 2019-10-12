import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { LayoutComponent } from '../layout/layout.component';


const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomeModule' },
  { path: 'settings', loadChildren: './master/master.module#MasterModule' },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }

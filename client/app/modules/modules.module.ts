import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { HomeModule } from './home/home.module';
import { MasterModule } from './master/master.module';
import {DemoMaterialModule} from '../material';


import { MyProfileComponent } from './user/my-profile/my-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './student/students/students.component';
import { StaffComponent } from './student/staff/staff.component';


@NgModule({
  declarations: [MyProfileComponent, DashboardComponent, StudentsComponent, StaffComponent],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    HomeModule,
    MasterModule,
    DemoMaterialModule
  ]
})
export class ModulesModule { }

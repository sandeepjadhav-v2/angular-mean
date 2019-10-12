import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import {DemoMaterialModule} from '../../material';

import { AcademicYearComponent } from './academic-year/academic-year.component';
import { CoursesComponent } from './courses/courses.component';
import { DesignationsComponent } from './designations/designations.component';
import { SchoolDetailsComponent } from './school-details/school-details.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { ClassesComponent } from './classes/classes.component';
import { SectionsComponent } from './sections/sections.component';

import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [AcademicYearComponent, CoursesComponent, DesignationsComponent, SchoolDetailsComponent,
    TimeTableComponent, ClassesComponent, SectionsComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    DemoMaterialModule,
    AgGridModule.withComponents(null)

  ]
})
export class MasterModule { }

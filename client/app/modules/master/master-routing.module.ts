import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcademicYearComponent } from './academic-year/academic-year.component';
import { CoursesComponent } from './courses/courses.component';
import { DesignationsComponent } from './designations/designations.component';
import { SchoolDetailsComponent } from './school-details/school-details.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { ClassesComponent } from './classes/classes.component';
import { SectionsComponent } from './sections/sections.component';

const routes: Routes = [
  { path: '', component: AcademicYearComponent },
  { path: 'academic-year', component: AcademicYearComponent },
  { path: 'school-details', component: SchoolDetailsComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'designations', component: DesignationsComponent },
  { path: 'time-table', component: TimeTableComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'sections', component: SectionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }

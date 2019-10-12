import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LayoutComponent } from './layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    FontAwesomeModule,
    NgMaterialMultilevelMenuModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    NgMaterialMultilevelMenuModule
  ]
})
export class LayoutModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import { LayoutModule } from './layout/layout.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DemoMaterialModule } from './material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    ModulesModule,
    LayoutModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    DemoMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

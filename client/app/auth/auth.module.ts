import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInModule } from './sign-in/sign-in.module';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SignInModule,
    HttpClientModule
  ],
  providers: [ AuthService ]
})
export class AuthModule { }

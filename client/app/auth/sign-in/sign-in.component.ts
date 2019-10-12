import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  returnUrl: string;
  error = '';
  user = {};
  loggedUser = {};
  constructor(private router: Router, private authService: AuthService) {
        // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) {
        //     this.router.navigate(['/']);
        // }
    }
  ngOnInit() {
    this.initForm();
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }
  login() {
    console.log('Login clicked...');

    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    this.user = {
      usernameOrEmail: this.f.usernameOrEmail.value,
      password: this.f.password.value
    };
    this.authService.loginUser(this.user)
    .subscribe(data => {
      console.log(data);
    });
    console.log('loggedUserL: ', this.loggedUser);
    this.router.navigate([`home`]);
  }
  get f() { return this.loginForm.controls; }

  private initForm() {
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }
}

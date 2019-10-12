import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl = './api';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }
  public loginUser(user) {

    return this.http.post(`${this.baseUrl}/auth/signin`, user, this.httpOptions);

    // .subscribe(
    //   (data => {
    //     console.log(`data ==> ${data}`);
    //     return data;
    //   }),
    //   (error => {
    //     console.log(`error ==> ${JSON.stringify(error)}`);
    //     return `${JSON.stringify(error)}`;
    //   })
    // );
 }
}

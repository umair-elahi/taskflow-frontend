import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISignInModel } from './sign-in/ISignInModel';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  signIn(credentials: ISignInModel): Promise<any> {
    return this.http.post(`auth/login`, credentials).toPromise();
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { ISignInModel } from './sign-in/ISignInModel';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {

//   constructor(private http: HttpClient) { }

//   signIn(email: string, password: string): Promise<any> {
//     const body: ISignInModel = {
//       email, password,
//       branchId: 0
//     };
//     return this.http.post(`auth/login`, body).toPromise();
//   }
// }

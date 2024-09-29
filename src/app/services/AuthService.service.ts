import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  baseUrl = 'http://localhost:8080';

  // Initialize the http client service
  constructor(private http: HttpClient) {
  }

  authenticate(username: string, password: string)  {
    return this.http.post(`${this.baseUrl}/auth/generateToken`, {
      username: username,
      password: password
    });
  }

  renewToken(token: string) {
    return this.http.post(`${this.baseUrl}/auth/renewToken`, {
      token: token
    });
  }

  registerUser(name: string, email: string, password: string) {
    return this.http.post(`${this.baseUrl}/auth/register`, {
      name: name,
      email: email,
      password: password
    });
  }

  viewProfile() {
    return this.http.get(`${this.baseUrl}/auth/user/userProfile`);
  }

}

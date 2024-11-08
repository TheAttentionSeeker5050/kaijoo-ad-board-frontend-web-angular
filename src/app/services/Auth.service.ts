import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseAPIUrl;

  // Initialize the http client service
  constructor(private http: HttpClient) {
  }

  authenticate(email: string, password: string)  {
    return this.http.post(`${this.baseUrl}/auth/authenticate`, JSON.stringify({
        email: email,
        password: password
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  renewToken(token: string) {
    return this.http.post(`${this.baseUrl}/auth/renew-token`, {
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
    return this.http.get(`${this.baseUrl}/auth/user/userProfile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  viewWelcomeScreen() {
    return this.http.get(`${this.baseUrl}/auth/welcome`);
  }


  // create a new Type of Error called AuthServiceResponseError



}

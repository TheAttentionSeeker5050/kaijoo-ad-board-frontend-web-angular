import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceService {

  baseUrl = 'http://localhost:8080';


  constructor(private httpClient: HttpClient) { }

  // Make generic http requests for: GET, POST, PUT, DELETE
  get(url: string) {
    return this.httpClient.get(`${this.baseUrl}/${url}`);
  };

  // get with token
  getWithToken(url: string, token: string) {
    return this.httpClient.get(`${this.baseUrl}/${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

  // The post, put, and delete methods take two parameters: the URL and the data to send to the server.
  // Additionally, they need a third paramether wich is the Authorization header token.
  post(url: string, data: any, token: string) {
    return this.httpClient.post(`${this.baseUrl}/${url}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

  put(url: string, data: any, token: string) {
    return this.httpClient.put(`${this.baseUrl}/${url}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

  delete(url: string, token: string) {
    return this.httpClient.delete(`${this.baseUrl}/${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

}

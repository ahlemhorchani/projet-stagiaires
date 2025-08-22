import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = 'http://localhost/backend/';

  constructor(private http: HttpClient) {}

  get(endpoint: string, params?: any): Observable<any> {
    const options = {
      params: new HttpParams({ fromObject: params }),
      headers: this.getHeaders()
    };
    return this.http.get(`${this.BASE_URL}${endpoint}`, options);
  }

  post(endpoint: string, data: any, params?: any): Observable<any> {
    const options = {
      params: new HttpParams({ fromObject: params }),
      headers: this.getHeaders()
    };
    return this.http.post(`${this.BASE_URL}${endpoint}`, data, options);
  }


// src/app/services/api.service.ts (getHeaders)
private getHeaders(): HttpHeaders {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  const token = localStorage.getItem('token');
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

}

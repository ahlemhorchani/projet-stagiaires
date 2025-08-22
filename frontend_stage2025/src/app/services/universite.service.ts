import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversiteService {
  private BASE_URL = 'http://localhost/backend/universites/';

  constructor(private http: HttpClient) {}

  getUniversites(): Observable<any> {
    return this.http.get(this.BASE_URL + 'get_universites.php', {
      headers: this.getAuthHeaders()
    });
  }

  createUniversite(data: any): Observable<any> {
    return this.http.post(this.BASE_URL + 'create_universite.php', data, {
      headers: this.getAuthHeaders()
    });
  }

  updateUniversite(data: any): Observable<any> {
    return this.http.post(this.BASE_URL + 'update_universite.php', data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUniversite(id: number): Observable<any> {
    return this.http.post(this.BASE_URL + 'delete_universite.php', { id }, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}

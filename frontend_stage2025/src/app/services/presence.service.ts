import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private apiUrl = 'http://localhost/backend/presences';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_all.php`, {
      headers: this.getHeaders()
    });
  }

  getByStagiaire(stagiaireId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_by_stagiaire.php?stagiaireId=${stagiaireId}`, {
      headers: this.getHeaders()
    });
  }
}

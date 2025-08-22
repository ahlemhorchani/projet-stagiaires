import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AffectationService {

  private BASE_URL = 'http://localhost/backend/affectations_stage/'; // note le slash final

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getByStagiaire(stagiaireId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}get_by_stagiaire.php?stagiaireId=${stagiaireId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAffectations(): Observable<any> {
    return this.http.get(`${this.BASE_URL}get_all.php`, {
      headers: this.getAuthHeaders()
    });
  }

  createAffectation(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}create.php`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateAffectation(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}update.php`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAffectation(id: number): Observable<any> {
    return this.http.post(`${this.BASE_URL}delete.php`, { id }, {
      headers: this.getAuthHeaders()
    });
  }
}

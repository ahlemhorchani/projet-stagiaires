import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StagiaireService {
  private BASE_URL = 'http://localhost/backend/stagiaires/';

  constructor(private http: HttpClient) {}

  /**
   * Récupère les stagiaires
   */
  getStagiaires(): Observable<any> {
    return this.http.get(this.BASE_URL + 'get_stagiaires.php', {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Crée un nouveau stagiaire
   */
  createStagiaire(data: any): Observable<any> {
    return this.http.post(this.BASE_URL + 'create_stagiaire.php', data, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Met à jour un stagiaire
   */
  updateStagiaire(data: any): Observable<any> {
    return this.http.post(this.BASE_URL + 'update_stagiaire.php', data, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Supprime un stagiaire par ID
   */
  deleteStagiaire(id: number): Observable<any> {
    return this.http.post(this.BASE_URL + 'delete_stagiaire.php', { id }, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Ajoute les headers avec le token JWT
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}

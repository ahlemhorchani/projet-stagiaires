import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyService {

  private apiUrl = 'http://localhost/backend/dailys'; // adapte à ton API

  constructor(private http: HttpClient) { }

  // Exemple : récupérer tous les rapports daily
  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/get_all.php');
  }

  // Exemple : récupérer les rapports d'un stagiaire donné
  getByStagiaire(stagiaireId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_by_stagiaire.php?stagiaireId=${stagiaireId}`);
  }

  // Ajouter d'autres méthodes CRUD si besoin
}

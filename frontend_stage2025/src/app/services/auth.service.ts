import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError, tap } from 'rxjs';
import { of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost/backend/auth/';


  constructor(private http: HttpClient, private router: Router) {}



  login(email: string, password: string): Observable<any> {
    const body = JSON.stringify({ email, password }); // Ajoutez JSON.stringify()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${this.API_URL}login.php`, body, { headers });
  }


   register(name: string, email: string, password: string) {
     // Laisse Angular gérer les headers et JSON
     return this.http.post<any>(`${this.API_URL}register.php`, { name, email, password });
   }


  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Supprime le token localement d'abord
    localStorage.removeItem('token');

    // Envoie la requête au serveur (mais ne bloque pas si elle échoue)
    return this.http.post(`${this.API_URL}logout.php`, {}, { headers }).pipe(
      catchError(err => {
        console.error('Erreur lors de la déconnexion serveur', err);
        // Même en cas d'erreur, on retourne un observable valide
        return of({ success: false, message: 'Déconnexion forcée côté client' });
      })
    );
  }





  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TypesStageService {
  private BASE_URL = 'http://localhost/backend/types_stage/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTypesStage(): Observable<any> {
    return this.http.get(this.BASE_URL + 'get_all.php', {
      headers: this.getAuthHeaders()
    });
  }


createTypeStage(data: any): Observable<any> {
  const token = this.authService.getToken();
  console.log('Token envoyé :', token); // <-- vérifie qu'il n'est pas null
  return this.http.post(this.BASE_URL + 'create.php', data, {
    headers: this.getAuthHeaders()
  });
}




  updateTypeStage(data: any): Observable<any> {
    return this.http.post(this.BASE_URL + 'update.php', data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteTypeStage(id: number): Observable<any> {
    return this.http.post(this.BASE_URL + 'delete.php', { id }, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}

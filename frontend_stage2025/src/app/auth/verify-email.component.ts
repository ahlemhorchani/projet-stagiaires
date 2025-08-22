import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  template: '<p>{{ message }}</p>'
})
export class VerifyEmailComponent implements OnInit {
  message = 'Vérification en cours...';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get(`http://localhost/backend/auth/verify_email.php?token=${token}`, { responseType: 'text' })
        .subscribe(
          res => this.message = res,
          err => this.message = 'Lien invalide ou expiré.'
        );
    }
  }
}

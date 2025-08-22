import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  private authSubscription?: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}


  onLogin(): void {
    if (this.loading) return;

    this.resetErrors();
    this.logLoginAttempt();

    this.loading = true;
    this.authSubscription = this.auth.login(this.email, this.password).subscribe({
      next: this.handleLoginSuccess.bind(this),
      error: this.handleLoginError.bind(this)
    });
  }


  private handleLoginSuccess(res: any): void {
    console.log("✅ Réponse du serveur :", res);
    this.loading = false;
    if (res?.success) {
      this.storeAuthToken(res.token);
      this.redirectUser(res.role);
    } else {
      this.error = res?.message || 'Erreur inconnue';
    }
  }

  /**
   * Gestion des erreurs de connexion
   */
  private handleLoginError(err: any): void {
    console.error('❌ Erreur complète :', err);
    this.loading = false;
    this.error = err.error?.message || 'Erreur serveur';
  }


  private storeAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }



private redirectUser(role: string): void {
  if (role === 'admin') {
    this.router.navigateByUrl('/admin/dashboard').then(success => {
      console.log('Navigation vers /admin/dashboard :', success);
    });
  } else {
    // this.router.navigate(['/stagiaire']);
  }
}





  private resetErrors(): void {
    this.error = '';
  }


  private logLoginAttempt(): void {
    console.log("🧪 Tentative de connexion :", {
      email: this.email,
      password: '[PROTECTED]'
    });
  }


  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}

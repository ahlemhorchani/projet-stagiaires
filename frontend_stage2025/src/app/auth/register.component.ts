import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Ajout de l'import Router
import { RouterModule } from '@angular/router'; // Ajout pour routerLink

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, RouterModule] // Ajout de RouterModule
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  message = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router // Injection du Router
  ) {}

  onRegister() {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message;
        // Option: Redirection automatique après inscription
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

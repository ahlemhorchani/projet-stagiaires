import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { StagiaireService } from '../services/stagiaire.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-stagiaires',
  standalone: true,
  templateUrl: './stagiaires.component.html',
  styleUrls: ['./stagiaires.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class StagiairesComponent implements OnInit {
  stagiaires: any[] = [];
  filteredStagiaires: any[] = [];
  newStagiaire = { name: '', email: '', cin: '' };
  editingStagiaire: any = null;
  searchQuery: string = '';
  loading: boolean = false;
  error: string | null = null;
  showUserMenu: boolean = false;

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private router: Router,
    private stagiaireService: StagiaireService
  ) {}

  ngOnInit() {
    this.loadStagiaires();
  }

  loadStagiaires() {
    this.loading = true;
    this.error = null;
    this.api.get('stagiaires/get_stagiaires.php').subscribe({
      next: (res: any) => {
        this.stagiaires = res;
        this.filteredStagiaires = [...res];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des stagiaires';
        console.error(err);
        this.loading = false;
      }
    });
  }

  addStagiaire() {
    const { name, email, cin } = this.newStagiaire;

    if (!name || !email || !cin) {
      this.error = 'Tous les champs sont obligatoires (Nom, Email, CIN)';
      return;
    }

    this.loading = true;
    this.error = null;

    this.stagiaireService.createStagiaire(this.newStagiaire).subscribe({
      next: () => {
        this.newStagiaire = { name: '', email: '', cin: '' };
        this.loadStagiaires();
      },
      error: (err: any) => {
        this.error = 'Erreur lors de l\'ajout: ' + (err.error?.message || err.message || 'Erreur inconnue');
        console.error('Erreur complète :', err);
        this.loading = false;
      }
    });
  }

  edit(stagiaire: any) {
    this.editingStagiaire = { ...stagiaire };
  }

  updateStagiaire() {
    const { name, email, cin } = this.editingStagiaire;
    if (!name || !email || !cin) {
      this.error = 'Tous les champs sont obligatoires';
      return;
    }

    this.loading = true;
    this.error = null;

    this.api.post('stagiaires/update_stagiaire.php', this.editingStagiaire).subscribe({
      next: () => {
        this.editingStagiaire = null;
        this.loadStagiaires();
      },
      error: (err: any) => {
        this.error = 'Erreur modification: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editingStagiaire = null;
  }

  deleteStagiaire(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce stagiaire ?')) {
      this.loading = true;
      this.error = null;

      this.api.post('stagiaires/delete_stagiaire.php', { id }).subscribe({
        next: () => this.loadStagiaires(),
        error: (err: any) => {
          this.error = 'Erreur suppression: ' + (err.error?.message || err.message);
          this.loading = false;
        }
      });
    }
  }

  filterStagiaires() {
    if (!this.searchQuery) {
      this.filteredStagiaires = [...this.stagiaires];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredStagiaires = this.stagiaires.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.cin.toLowerCase().includes(query)
    );
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

   confirmLogout(): void {
      console.log('Token avant déconnexion:', this.authService.getToken());
      if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        this.logout();
      }
      this.showUserMenu = false;
    }

    logout(): void {
      this.authService.logout().subscribe({
        next: (res: any) => {
          console.log('Déconnexion réussie', res);
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
        error: (err: any) => { // Fix the type here too
          console.error('Erreur lors de la déconnexion', err);
          // Même en cas d'erreur, on force la déconnexion côté client
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    }

  isDashboardPage() { return this.router.url.includes('/admin/dashboard'); }
  isStagiairesPage() { return this.router.url.includes('/admin/stagiaires'); }
  isTypesStagePage() { return this.router.url.includes('/admin/types-stage'); }
  isAffectationsPage() { return this.router.url.includes('/admin/affectations'); }
  isUniversitesPage() { return this.router.url.includes('/admin/universites'); }
  isPresencesPage() { return this.router.url.includes('/admin/presences'); }
  isDailysPage() { return this.router.url.includes('/admin/dailys'); }
}

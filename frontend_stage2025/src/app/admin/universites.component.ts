import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { UniversiteService } from '../services/universite.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Ajoutez cette interface
interface Universite {
  id: number;
  nom: string;
  adresse: string;
  created_at: string;
}

@Component({
  selector: 'app-universites',
  standalone: true,
  templateUrl: './universites.component.html',
  styleUrls: ['./universites.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class UniversitesComponent implements OnInit {
  // États
  loading = false;
  error: string | null = null;
  showUserMenu = false;
  searchQuery = '';

  // Données
  universites: Universite[] = [];
  filteredUniversites: Universite[] = [];
  newUniversite: Omit<Universite, 'id' | 'created_at'> = { nom: '', adresse: '' };
  editingUniversite: Universite | null = null;

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private router: Router,
    private universiteService: UniversiteService
  ) {}

  ngOnInit() {
    this.loadUniversites();
  }

  // Méthode utilitaire pour vérifier l'édition
  isEditing(universite: Universite): boolean {
    return !!this.editingUniversite && this.editingUniversite.id === universite.id;
  }

  // Méthode de filtrage
  filterUniversites() {
    if (!this.searchQuery) {
      this.filteredUniversites = [...this.universites];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredUniversites = this.universites.filter(u =>
      u.nom.toLowerCase().includes(query) ||
      u.adresse.toLowerCase().includes(query)
    );
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  loadUniversites() {
    this.loading = true;
    this.error = null;
    this.api.get('universites/get_universites.php').subscribe({
      next: (res: any) => {
        this.universites = res;
        this.filteredUniversites = [...res];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des universités';
        this.loading = false;
        console.error(err);
      }
    });
  }

  goToUniversities() {
    this.router.navigate(['/universities']);
  }

  isUniversitiesPage(): boolean {
    return this.router.url === '/universities';
  }

  addUniversite() {
    const { nom, adresse } = this.newUniversite;
    if (!nom || !adresse) {
      this.error = 'Tous les champs sont obligatoires (Nom, Adresse)';
      return;
    }

    this.loading = true;
    this.universiteService.createUniversite(this.newUniversite).subscribe({
      next: () => {
        this.newUniversite = { nom: '', adresse: '' };
        this.error = null;
        this.loadUniversites();
      },
      error: (err) => {
        this.error = 'Erreur ajout: ' + (err.error?.message || err.message || 'Erreur inconnue');
        this.loading = false;
        console.error(err);
      }
    });
  }

  edit(universite: Universite) {
    this.editingUniversite = { ...universite };
  }

  updateUniversite() {
    if (!this.editingUniversite) return;

    const { nom, adresse } = this.editingUniversite;
    if (!nom || !adresse) {
      this.error = 'Tous les champs sont obligatoires';
      return;
    }

    this.loading = true;
    this.api.post('universites/update_universite.php', this.editingUniversite).subscribe({
      next: () => {
        this.editingUniversite = null;
        this.error = null;
        this.loadUniversites();
      },
      error: (err) => {
        this.error = 'Erreur modification: ' + (err.error?.message || err.message);
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.editingUniversite = null;
    this.error = null;
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


  deleteUniversite(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer cette université ?')) return;

    this.loading = true;
    this.api.post('universites/delete_universite.php', { id }).subscribe({
      next: () => {
        this.loadUniversites();
      },
      error: (err) => {
        this.error = 'Erreur suppression: ' + (err.error?.message || err.message);
        this.loading = false;
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

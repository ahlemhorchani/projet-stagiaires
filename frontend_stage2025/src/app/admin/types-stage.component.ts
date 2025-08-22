import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TypesStageService } from '../services/types-stage.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
interface TypeStage {
  id: number;
  libelle: string;
  created_at?: string;
}

@Component({
  selector: 'app-types-stage',
  standalone: true,
  templateUrl: './types-stage.component.html',
  styleUrls: ['./types-stage.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TypesStageComponent implements OnInit {
  // Données
  types: TypeStage[] = [];
  filteredTypes: TypeStage[] = [];
  newType = { libelle: '' };
  editingType: TypeStage | null = null;
  searchQuery = '';

  // États
  loading = false;
  error: string | null = null;
  showUserMenu = false;


  constructor(
    private authService: AuthService,
    private typesStageService: TypesStageService,
    private router: Router
  ) {}

  ngOnInit() {
      this.loadTypesStage();
    }

  // Méthodes pour le header
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


  // Méthodes CRUD
  loadTypesStage() {
    this.loading = true;
    this.error = null;
    this.typesStageService.getTypesStage().subscribe({
      next: (res) => {
        this.types = res;
        this.filteredTypes = [...res];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  // Alias pour la compatibilité avec le template
  loadTypes() {
    this.loadTypesStage();
  }

  filterTypes() {
    if (!this.searchQuery) {
      this.filteredTypes = [...this.types];
      return;
    }
    this.filteredTypes = this.types.filter(type =>
      type.libelle.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addType() {
    if (!this.newType.libelle) {
      this.error = 'Le libellé est obligatoire';
      return;
    }
    this.loading = true;
    this.typesStageService.createTypeStage(this.newType).subscribe({
      next: () => {
        this.newType = { libelle: '' };
        this.loadTypesStage();
      },
      error: (err) => {
        this.error = 'Erreur ajout: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  edit(type: TypeStage) {
    this.editingType = { ...type };
  }

  updateType() {
    if (!this.editingType || !this.editingType.libelle) {
      this.error = 'Le libellé est obligatoire';
      return;
    }
    this.loading = true;
    this.typesStageService.updateTypeStage(this.editingType).subscribe({
      next: () => {
        this.editingType = null;
        this.loadTypesStage();
      },
      error: (err) => {
        this.error = 'Erreur modification: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editingType = null;
    this.error = null;
  }
 isEditingType(type: TypeStage): boolean {
   return !!this.editingType && this.editingType.id === type.id;
 }

  deleteType(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce type de stage ?')) {
      this.loading = true;
      this.typesStageService.deleteTypeStage(id).subscribe({
        next: () => this.loadTypesStage(),
        error: (err) => {
          this.error = 'Erreur suppression: ' + (err.error?.message || err.message);
          this.loading = false;
        }
      });
    }
  }
isDashboardPage() { return this.router.url.includes('/admin/dashboard'); }
  isStagiairesPage() { return this.router.url.includes('/admin/stagiaires'); }
  isTypesStagePage() { return this.router.url.includes('/admin/types-stage'); }
  isAffectationsPage() { return this.router.url.includes('/admin/affectations'); }
  isUniversitesPage() { return this.router.url.includes('/admin/universites'); }
  isPresencesPage() { return this.router.url.includes('/admin/presences'); }
  isDailysPage() { return this.router.url.includes('/admin/dailys'); }
}

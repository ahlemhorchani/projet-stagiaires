import { Component, OnInit, HostListener , ElementRef } from '@angular/core';
import { StagiaireService } from '../services/stagiaire.service';
import { AffectationService } from '../services/affectation.service';
import { PresenceService } from '../services/presence.service';
import { DailyService } from '../services/daily.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class DashboardComponent implements OnInit {
  stagiaires: any[] = [];
  filteredStagiaires: any[] = [];
  searchQuery: string = '';
  selectedStagiaire: any = null;
  affectations: any[] = [];
  presences: any[] = [];
  dailys: any[] = [];
  loading = false;
  error = '';
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private stagiaireService: StagiaireService,
    private affectationService: AffectationService,
    private presenceService: PresenceService,
    private dailyService: DailyService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadStagiaires();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }


 @HostListener('document:click', ['$event'])
 onClickOutside(event: MouseEvent): void {
   const target = event.target as HTMLElement;
   if (!this.elRef.nativeElement.contains(target)) {
     this.showUserMenu = false;
   }
 }

  goToStagiaires(): void {
    this.router.navigate(['/admin/stagiaires']);
  }




  loadStagiaires(): void {
    this.loading = true;
   this.stagiaireService.getStagiaires().subscribe({
     next: (data: any) => {
       this.stagiaires = data;
       this.filteredStagiaires = [...data];
       this.loading = false;
     },
     error: (err: any) => {
       this.error = 'Erreur chargement stagiaires';
       this.loading = false;
     }
   });
  }

  selectStagiaire(stagiaire: any): void {
    this.selectedStagiaire = stagiaire;
    this.loadRelatedData(stagiaire.id);
  }

  loadRelatedData(stagiaireId: number): void {
    this.affectationService.getByStagiaire(stagiaireId).subscribe((data: any) => {
      this.affectations = data;
    });

    this.presenceService.getByStagiaire(stagiaireId).subscribe(data => this.presences = data);
    this.dailyService.getByStagiaire(stagiaireId).subscribe(data => this.dailys = data);
  }

  deleteStagiaire(id: number): void {
    if (!confirm('Confirmer la suppression ?')) return;
    this.stagiaireService.deleteStagiaire(id).subscribe(() => {
      this.loadStagiaires();
      this.selectedStagiaire = null;
    });
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
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
        // Même en cas d'erreur, on force la déconnexion côté client
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }



 filterStagiaires() {
     if (!this.searchQuery) {
       this.filteredStagiaires = [...this.stagiaires];
       return;
     }

     const query = this.searchQuery.toLowerCase();
     this.filteredStagiaires = this.stagiaires.filter(s =>
       (s.name?.toLowerCase().includes(query) ||
       s.email?.toLowerCase().includes(query) ||
       s.cin?.toLowerCase().includes(query))
     );
   }
isDashboardPage() { return this.router.url.includes('/admin/dashboard'); }
  isStagiairesPage() { return this.router.url.includes('/admin/stagiaires'); }
  isTypesStagePage() { return this.router.url.includes('/admin/types-stage'); }
  isAffectationsPage() { return this.router.url.includes('/admin/affectations'); }
  isUniversitesPage() { return this.router.url.includes('/admin/universites'); }
  isPresencesPage() { return this.router.url.includes('/admin/presences'); }
  isDailysPage() { return this.router.url.includes('/admin/dailys'); }

}

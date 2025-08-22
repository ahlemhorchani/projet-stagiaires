import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AffectationService } from '../services/affectation.service';
import { HttpClient } from '@angular/common/http';
import { UniversiteService } from '../services/universite.service';
import { TypesStageService } from '../services/types-stage.service';
import { jsPDF } from 'jspdf';
import { AuthService } from '../services/auth.service';
// Définition de l'interface manquante
interface TypeStage {
  id: number;
  libelle: string;
  created_at?: string;
}

@Component({
  selector: 'app-affectations',
  standalone: true,
  templateUrl: './affectations.component.html',
  styleUrls: ['./affectations.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})

export class AffectationsComponent implements OnInit {
  affectations: any[] = [];
  filteredAffectations: any[] = [];
  stagiaires: any[] = [];
  universites: any[] = [];
  typesStage: any[] = [];
  showUserMenu: boolean = false;

  newAffectation: {
    [key: string]: any;
    stagiaire_id: string;
    universite_id: string;
    type_stage_id: string;
    specialite: string;
    date_debut: string;
    date_fin: string;
    annee_scolaire: string;
    observation: string;
  } = {
    stagiaire_id: '',
    universite_id: '',
    type_stage_id: '',
    specialite: '',
    date_debut: '',
    date_fin: '',
    annee_scolaire: '',
    observation: ''
  };

  editingAffectation: any = null;
  searchQuery: string = '';
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private universiteService: UniversiteService,
    private typesStageService: TypesStageService
  ) {}

  ngOnInit() {
    this.loadAffectations();
    this.loadSelectData();
  }

  loadAffectations() {
    this.loading = true;
    this.api.get('affectations_stage/get_all.php').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.affectations = res.data;
          this.filteredAffectations = [...res.data];
        } else {
          this.error = 'Erreur serveur : ' + res.message;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des affectations';
        this.loading = false;
      }
    });
  }

  showAddUniversiteForm = false;
  newUniversite = { nom: '', adresse: '' };

  // Type de stage
  showAddTypeStageForm = false;
  newTypeStage = { libelle: '' };

  loadSelectData() {
    this.api.get('stagiaires/get_stagiaires.php').subscribe((res: any) => this.stagiaires = res);
    this.api.get('universites/get_universites.php').subscribe((res: any) => this.universites = res);
    this.api.get('types_stage/get_all.php').subscribe((res: any) => this.typesStage = res);
  }

  addUniversite() {
    console.log('Token actuel:', localStorage.getItem('token'));
    const { nom, adresse } = this.newUniversite;
    if (!nom || !adresse) {
      this.error = 'Tous les champs sont obligatoires (Nom, Adresse)';
      return;
    }

    this.loading = true;
    this.universiteService.createUniversite(this.newUniversite).subscribe({
      next: (res: any) => {
        if (res && res.id) {
          // Ajoute la nouvelle université à la liste
          this.universites.push(res);

          // Sélectionne automatiquement la nouvelle université
          if (this.editingAffectation) {
            this.editingAffectation.universite_id = res.id;
          } else {
            this.newAffectation.universite_id = res.id;
          }

          this.newUniversite = { nom: '', adresse: '' };
          this.showAddUniversiteForm = false;
          this.error = null;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur ajout: ' + (err.error?.message || err.message || 'Erreur inconnue');
        this.loading = false;
        console.error(err);
      }
    });
  }

  // CORRECTION de la méthode addTypeStage
  addTypeStage() {
    console.log('Données envoyées:', { libelle: this.newTypeStage.libelle });
    if (!this.newTypeStage.libelle.trim()) {
      this.error = 'Le libellé est obligatoire';
      return;
    }

    this.loading = true;
    const typeStageData = { libelle: this.newTypeStage.libelle };

    this.typesStageService.createTypeStage(typeStageData).subscribe({
      next: (res: any) => {
        if (res.success) {
          // Ajouter le nouveau type à la liste
          this.typesStage.push(res.data);

          // Sélectionner automatiquement le nouveau type
          if (this.editingAffectation) {
            this.editingAffectation.type_stage_id = res.data.id;
          } else {
            this.newAffectation.type_stage_id = res.data.id;
          }

          this.showAddTypeStageForm = false;
          this.newTypeStage.libelle = '';
          this.error = null;
        } else {
          this.error = res.message || 'Erreur lors de la création';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur serveur: ' + (err.error?.message || err.message || 'Erreur inconnue');
        this.loading = false;
        console.error('Erreur détaillée:', err);
      }
    });
  }

  addAffectation() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.api.post('affectations_stage/create.php', this.newAffectation).subscribe({
      next: () => {
        this.resetForm();
        this.loadAffectations();
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'ajout';
        this.loading = false;
        console.error(err);
      }
    });
  }

  validateForm(): boolean {
    const requiredFields = [
      'stagiaire_id',
      'universite_id',
      'type_stage_id',
      'specialite',
      'date_debut',
      'date_fin',
      'annee_scolaire'
    ];

    for (const field of requiredFields) {
      if (!this.newAffectation[field]) {
        this.error = `Le champ ${field} est obligatoire.`;
        return false;
      }
    }

    this.error = null;
    return true;
  }

  resetForm() {
    this.newAffectation = {
      stagiaire_id: '',
      universite_id: '',
      type_stage_id: '',
      specialite: '',
      date_debut: '',
      date_fin: '',
      annee_scolaire: '',
      observation: ''
    };
  }

  edit(affectation: any) {
    this.editingAffectation = { ...affectation };
  }

  updateAffectation() {
    const { stagiaire_id, universite_id, type_stage_id, date_debut, date_fin } = this.editingAffectation;
    if (!stagiaire_id || !universite_id || !type_stage_id || !date_debut || !date_fin) {
      this.error = 'Tous les champs sont obligatoires';
      return;
    }
    this.loading = true;
    this.api.post('affectations_stage/update.php', this.editingAffectation).subscribe({
      next: () => {
        this.editingAffectation = null;
        this.loadAffectations();
      },
      error: () => {
        this.error = 'Erreur lors de la modification';
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editingAffectation = null;
  }

  deleteAffectation(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette affectation ?')) {
      this.loading = true;
      this.api.post('affectations_stage/delete.php', { id }).subscribe({
        next: () => this.loadAffectations(),
        error: () => {
          this.error = 'Erreur lors de la suppression';
          this.loading = false;
        }
      });
    }
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



  // méthode pour générer l'attestation - CORRIGÉE
  generateAttestation(affectation: any) {
    console.log('Génération du PDF professionnel pour:', affectation);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // En-tête avec cadre
    doc.setDrawColor(70, 130, 180);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 25);

    // CORRECTION: Utilisation correcte de setFont
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 130, 180);
    doc.text('ATTESTATION DE STAGE', pageWidth / 2, yPosition + 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`N° ${affectation.id}`, pageWidth / 2, yPosition + 22, { align: 'center' });

    yPosition += 35;

    // Cachet de l'établissement (optionnel)
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(0.5);
    doc.circle(pageWidth - margin - 20, yPosition - 10, 15, 'D');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Cachet de', pageWidth - margin - 20, yPosition - 13, { align: 'center' });
    doc.text('l\'établissement', pageWidth - margin - 20, yPosition - 8, { align: 'center' });

    // Contenu principal
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    // CORRECTION: Utilisation correcte de setFont
    doc.setFont('helvetica', 'normal');

    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const city = '_____________'; // Laissez vide pour remplir manuellement

    const paragraphs = [
      `Je soussigné(e), responsable de l'encadrement des stagiaires, atteste que :`,
      ``,
      `Monsieur/Madame ${affectation.stagiaire_nom.toUpperCase()}`,
      `a effectué un stage au sein de notre établissement dans le cadre de sa formation.`,
      ``,
      `Période du stage : du ${this.formatDate(affectation.date_debut)} au ${this.formatDate(affectation.date_fin)}`,
      `Type de stage : ${affectation.type_stage_nom}`,
      `Spécialité : ${affectation.specialite}`,
      `Année scolaire : ${affectation.annee_scolaire}`,
      ``,
      `Durant cette période, le(la) stagiaire a fait preuve de sérieux, de motivation et d'assiduité.`,
      `Il/Elle a réalisé les missions qui lui ont été confiées avec compétence et professionnalisme.`,
      ``,
      `La présente attestation est délivrée pour servir et valoir ce que de droit.`
    ];

    // Ajouter les paragraphes
    paragraphs.forEach(paragraph => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }

      const lines = doc.splitTextToSize(paragraph, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 7;
    });

    yPosition += 10;

    // Signature
    doc.text(`Fait à ${city}, le ${formattedDate}`, margin, yPosition);
    yPosition += 20;

    doc.text('Le Responsable des Stages', margin, yPosition);
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yPosition + 3, margin + 60, yPosition + 3);

    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Nom et signature précédés de la mention « Lu et approuvé »', margin, yPosition);

    // Sauvegarder le PDF
    const fileName = `Attestation_Stage_${affectation.stagiaire_nom.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  }

  // Fonction utilitaire pour formater les dates
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
filterAffectations() {
  const q = this.searchQuery.toLowerCase();
  this.filteredAffectations = this.affectations.filter(a =>
    a.stagiaire_nom.toLowerCase().includes(q) ||
    a.universite_nom.toLowerCase().includes(q) ||
    a.type_stage_nom.toLowerCase().includes(q) ||
    a.specialite.toLowerCase().includes(q) ||
    a.annee_scolaire.toLowerCase().includes(q)
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

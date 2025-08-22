import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-daily',
  standalone: true,
  templateUrl: './daily.component.html',
  imports: [CommonModule, FormsModule]

})
export class DailyComponent {
  content = '';

  constructor(private api: ApiService) {}

  submitDaily() {
    if (!this.content.trim()) {
      alert('Veuillez remplir votre rapport');
      return;
    }
    this.api.post('stagiaire/submit_daily.php', { content: this.content }).subscribe({
      next: () => {
        alert('Rapport envoyé');
        this.content = '';
      },
      error: err => alert('Erreur : ' + err.error.message)
    });
  }
}

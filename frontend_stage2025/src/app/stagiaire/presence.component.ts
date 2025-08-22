import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-presence',
  standalone: true,
  templateUrl: './presence.component.html',
  imports: [CommonModule, FormsModule]

})
export class PresenceComponent {
  status = 'present';

  constructor(private api: ApiService) {}

  markPresence() {
    this.api.post('stagiaire/mark_presence.php', { status: this.status }).subscribe({
      next: () => alert('Présence enregistrée'),
      error: err => alert('Erreur : ' + err.error.message)
    });
  }
}

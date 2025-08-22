import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 Import ici aussi

@Component({
  selector: 'app-root',
  standalone: true, // 👈 important si standalone
  imports: [RouterOutlet, FormsModule], // 👈 Ajoute FormsModule ici
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // attention au pluriel "styleUrls"
})
export class App {
  protected readonly title = signal('frontend_stage2025');
}

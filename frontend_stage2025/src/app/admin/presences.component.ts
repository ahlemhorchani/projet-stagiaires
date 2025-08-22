import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-presences',
  standalone: true,
  templateUrl: './presences.component.html',
  imports: [CommonModule, FormsModule]
})
export class PresencesComponent implements OnInit {
  presences: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get('admin/get_presences.php').subscribe(res => this.presences = res);
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.scss'],
  standalone: false,
})
export class ServerStatusComponent {
  constructor(public authService: AuthService) {}

  get serverName(): string {
    const url = this.authService.serverUrl();
    if (url.includes('8000')) {
      return 'Laravel REST API Backend';
    } else if (url.includes('3000')) {
      return 'Native Node.js REST API Backend';
    } else if (url.includes('3001')) {
      return 'Express REST API Backend';
    } else if (url.includes('3002')) {
      return 'NestJS Enterprise API Backend';
    } else if (url.includes('3003')) {
      return 'Spring Boot Enterprise API Backend';
    }
    return 'Target Backend Server';
  }
}

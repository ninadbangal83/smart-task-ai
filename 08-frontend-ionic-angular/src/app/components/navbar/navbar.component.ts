import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
})
export class NavbarComponent implements OnInit, OnDestroy {
  private healthInterval: any;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.startHealthPolling();
  }

  ngOnDestroy() {
    this.stopHealthPolling();
  }

  private startHealthPolling() {
    this.stopHealthPolling();
    // Poll health every 10 seconds
    this.healthInterval = setInterval(() => {
      this.authService.checkServerHealth();
    }, 10000);
  }

  private stopHealthPolling() {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.healthInterval = null;
    }
  }

  setServerUrl(url: string) {
    this.authService.setServerUrl(url);
  }

  logout() {
    this.authService.logout();
  }
}

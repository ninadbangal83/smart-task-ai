import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiClientService } from '../../core/services/api-client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  isRegister: boolean = false;
  
  name: string = '';
  email: string = '';
  password: string = '';
  role: 'user' | 'admin' = 'user';

  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    public authService: AuthService,
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit() {
    // If already logged in, go straight to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = null;
    this.isLoading = true;

    try {
      if (this.isRegister) {
        const response = await this.apiClient.post<any>('/api/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        const { user, token } = response;
        this.authService.loginSuccess(user, token);
      } else {
        const response = await this.apiClient.post<any>('/api/auth/login', {
          email: this.email,
          password: this.password,
        });
        const { user, token } = response;
        this.authService.loginSuccess(user, token);
      }
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage = err.message || 'Authentication failed. Make sure your server is online.';
    } finally {
      this.isLoading = false;
    }
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.errorMessage = null;
  }
}

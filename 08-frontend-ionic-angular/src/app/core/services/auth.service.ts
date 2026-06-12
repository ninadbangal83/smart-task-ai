import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';

export interface ServerHealth {
  status: string;
  timestamp: string;
  database?: string;
  broker?: string;
  mode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly LOCAL_STORAGE_URL_KEY = 'smarttask_server_url';
  private readonly LOCAL_STORAGE_TOKEN_KEY = 'smarttask_token';
  private readonly LOCAL_STORAGE_STRATEGY_KEY = 'smarttask_strategy';
  private readonly LOCAL_STORAGE_USER_KEY = 'smarttask_user';

  // State Signals
  private readonly _user = signal<User | null>(this.getInitialUser());
  private readonly _token = signal<string | null>(localStorage.getItem(this.LOCAL_STORAGE_TOKEN_KEY));
  private readonly _serverUrl = signal<string>(localStorage.getItem(this.LOCAL_STORAGE_URL_KEY) || 'http://localhost:8000');
  private readonly _authStrategy = signal<'JWT' | 'SESSION'>((localStorage.getItem(this.LOCAL_STORAGE_STRATEGY_KEY) as 'JWT' | 'SESSION') || 'JWT');
  private readonly _serverHealth = signal<ServerHealth | null>(null);
  private readonly _isConnecting = signal<boolean>(false);

  // Readonly Computeds/Signals for components
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly serverUrl = this._serverUrl.asReadonly();
  readonly authStrategy = this._authStrategy.asReadonly();
  readonly serverHealth = this._serverHealth.asReadonly();
  readonly isConnecting = this._isConnecting.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor(private http: HttpClient) {
    // Initial server health check
    this.checkServerHealth();
  }

  setServerUrl(url: string) {
    localStorage.setItem(this.LOCAL_STORAGE_URL_KEY, url);
    this._serverUrl.set(url);
    this.checkServerHealth();
  }

  setAuthStrategy(strategy: 'JWT' | 'SESSION') {
    localStorage.setItem(this.LOCAL_STORAGE_STRATEGY_KEY, strategy);
    this._authStrategy.set(strategy);
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem(this.LOCAL_STORAGE_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.LOCAL_STORAGE_TOKEN_KEY);
    }
    this._token.set(token);
  }

  loginSuccess(user: User, token?: string) {
    localStorage.setItem(this.LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    if (token) {
      this.setToken(token);
    }
    this._user.set(user);
  }

  logout() {
    localStorage.removeItem(this.LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(this.LOCAL_STORAGE_TOKEN_KEY);
    this._user.set(null);
    this._token.set(null);
  }

  async checkServerHealth(): Promise<void> {
    this._isConnecting.set(true);
    try {
      const url = this._serverUrl();
      // Use firstValueFrom to convert observable to promise
      const data = await firstValueFrom(
        this.http.get<any>(`${url}/health`)
      );

      const serverStrategy = data.authStrategy;
      if (serverStrategy && (serverStrategy === 'JWT' || serverStrategy === 'SESSION')) {
        if (this._authStrategy() !== serverStrategy) {
          console.log(`%c[Auth Sync] Backend reported ${serverStrategy}. Auto-aligning frontend!`, 'color: #10b981; font-weight: bold;');
          this.setAuthStrategy(serverStrategy);
        }
      }

      this._serverHealth.set({
        status: data.status || 'UP',
        timestamp: data.timestamp || new Date().toISOString(),
        database: data.database || 'Detected (Mongo/Pg)',
        broker: data.broker || 'Active',
        mode: data.mode || 'Active'
      });
    } catch (err) {
      console.error('[Health Check Error]', err);
      this._serverHealth.set(null);
    } finally {
      this._isConnecting.set(false);
    }
  }

  private getInitialUser(): User | null {
    try {
      const u = localStorage.getItem(this.LOCAL_STORAGE_USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
}

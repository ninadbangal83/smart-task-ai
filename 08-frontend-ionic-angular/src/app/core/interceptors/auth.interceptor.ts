import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let baseUrl = this.authService.serverUrl();
    // Trim trailing slash from baseURL and leading slash from request url
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    let url = request.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (!url.startsWith('/')) {
        url = '/' + url;
      }
      url = baseUrl + url;
    }

    let headers = request.headers.set('Accept', 'application/json');

    // Attach token if using JWT strategy
    const strategy = this.authService.authStrategy();
    const token = this.authService.token();

    console.log(`%c[Auth System] Active Strategy: %c${strategy}`,
      'color: #a855f7; font-weight: bold;',
      'color: #fbbf24; font-weight: bold; text-decoration: underline;'
    );

    if (strategy === 'JWT') {
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
        console.log(`%c[Auth System] Appended JWT Token: %c${token.substring(0, 15)}...`,
          'color: #a855f7; font-weight: bold;',
          'color: #e9d5ff;'
        );
      } else {
        console.log(`%c[Auth System] %c⚠️ Missing JWT Token for request!`,
          'color: #a855f7; font-weight: bold;',
          'color: #fca5a5;'
        );
      }
    } else if (strategy === 'SESSION') {
      console.log(`%c[Auth System] %c🍪 Sending requests with withCredentials (Cookies automated by Browser)`,
        'color: #a855f7; font-weight: bold;',
        'color: #c084fc; font-weight: bold;'
      );
    }

    // Clone request with new URL, headers, and withCredentials set to true (essential for session cookie)
    const modifiedReq = request.clone({
      url,
      headers,
      withCredentials: true
    });

    console.log(`%c[API Request] %c${modifiedReq.method} %c${modifiedReq.url}`,
      'color: #3b82f6; font-weight: bold;',
      'color: #10b981; font-weight: bold;',
      'color: #f59e0b;'
    );

    return next.handle(modifiedReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log(`%c[API Response] %c${event.status} %c${event.url}`,
            'color: #10b981; font-weight: bold;',
            'color: #3b82f6; font-weight: bold;',
            'color: #6b7280;'
          );

          // Capture and save X-Auth-Token from headers if the backend sent one
          const jwtToken = event.headers.get('x-auth-token');
          if (jwtToken) {
            this.authService.setToken(jwtToken);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const status = error.status;
        const message = error.error?.message || error.message || 'An unexpected error occurred';

        console.error(`%c[API Response Error] %c${status || 'NETWORK'} %c${message}`,
          'color: #ef4444; font-weight: bold;',
          'color: #f59e0b; font-weight: bold;',
          'color: #6b7280;'
        );

        // Auto logout on 401 Unauthorized if previously logged in
        if (status === 401) {
          this.authService.logout();
        }

        return throwError(() => new Error(message));
      })
    );
  }
}

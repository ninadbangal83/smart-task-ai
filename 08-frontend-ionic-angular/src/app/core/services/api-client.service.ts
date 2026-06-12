import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(url));
  }

  post<T>(url: string, body: any): Promise<T> {
    return firstValueFrom(this.http.post<T>(url, body));
  }

  put<T>(url: string, body: any): Promise<T> {
    return firstValueFrom(this.http.put<T>(url, body));
  }

  delete<T>(url: string): Promise<T> {
    return firstValueFrom(this.http.delete<T>(url));
  }
}

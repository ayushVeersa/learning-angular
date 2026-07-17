import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { environment } from '../../../environment/environment';

import { LoginRequest } from '../models/auth';
import { RegisterRequest } from '../models/auth';
import { LoginResponse } from '../models/auth';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);

  private readonly TOKEN_KEY = 'access_token';

  register(request: RegisterRequest): Observable<User> {

    return this.http.post<User>(
      `${environment.apiUrl}/auth/register`,
      request
    );

  }

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${environment.apiUrl}/auth/login`,
        request
      )
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
        })
      );

  }

  me(): Observable<User> {

    return this.http
      .get<User>(
        `${environment.apiUrl}/auth/me`
      )
      .pipe(
        tap(user => this.currentUser.set(user))
      );

  }

  logout(): void {

    localStorage.removeItem(this.TOKEN_KEY);

    this.currentUser.set(null);

    this.router.navigate(['/login']);

  }

  getToken(): string | null {

    return localStorage.getItem(this.TOKEN_KEY);

  }

  isLoggedIn(): boolean {

  const token = this.getToken();

  console.log('Token:', token);

  return !!token;

}

}
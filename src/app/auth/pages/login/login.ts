import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const request: LoginRequest = this.loginForm.getRawValue();

    this.authService.login(request).subscribe({

      next: () => {

        console.log("Login Success");
        this.authService.me().subscribe({
          next: (user) => {
            this.loading.set(false);
            console.log(user);
            console.log("Navigating");
            this.router.navigate(['/dashboard']);
          },

          error: () => {

            this.loading.set(false);

            this.errorMessage.set('Unable to load user.');

          }

        });

      },

      error: (err) => {

        this.loading.set(false);

        this.errorMessage.set(
          err.error?.detail ?? 'Invalid email or password.'
        );

      }

    });

  }

}
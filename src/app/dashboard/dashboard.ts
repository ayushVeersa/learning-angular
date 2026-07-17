import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;

  ngOnInit(): void {

    this.authService.me().subscribe({
      next: () => {
        console.log('User Loaded');
      },
      error: () => {
        this.authService.logout();
      }
    });

  }

  logout(): void {
    this.authService.logout();
  }

}
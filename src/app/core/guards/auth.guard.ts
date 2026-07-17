import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Guard Running');

  // console.log('Token:', authService.getToken());

  console.log('Logged In:', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    console.log('Allowing Dashboard');
    return true;
  }

  console.log('Redirecting to Login');

  return router.createUrlTree(['/login']);
};
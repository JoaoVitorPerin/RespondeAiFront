import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const redirectRootGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return router.createUrlTree(['/home']);
  }

  return router.createUrlTree(['/auth/login']);
};

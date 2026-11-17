import { CanActivateFn } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
  return true;
  }
else {
  window.location.href = '/login';
  return false;
  }
 
};

import { Routes } from '@angular/router';

export const RELATORIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./relatorios.component').then(c => c.RelatoriosComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
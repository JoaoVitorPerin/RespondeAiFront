import { Routes } from '@angular/router';

export const BASE_CONHECIMENTO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./base-conhecimento.component').then(c => c.BaseConhecimentoComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
import { Routes } from '@angular/router';

export const CHAT_ROUTES: Routes = [
  {
    path: ':hashPolitian',
    loadComponent: () =>
      import('./chat.component').then(c => c.ChatComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
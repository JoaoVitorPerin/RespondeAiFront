import { Routes } from '@angular/router';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./chat.component').then(c => c.ChatComponent),
  },
  {
    path: ':roomId',
    loadComponent: () =>
      import('./chat.component').then(c => c.ChatComponent),
  },
];
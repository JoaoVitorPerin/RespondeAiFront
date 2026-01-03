import { Routes } from '@angular/router';
import { ChatComponent } from './modules/chat/chat.component';
import { authGuard } from '../shared/guards/authGuard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
        import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: 'chat',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/chat/chat.routes').then(m => m.CHAT_ROUTES),
    },
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', redirectTo: 'login' },
];

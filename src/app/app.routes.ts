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
        loadChildren: () =>
            import('./modules/chat/chat.routes').then(m => m.CHAT_ROUTES),
    },
    {
        path: 'home',
        loadChildren: () =>
            import('./modules/home/home.routes').then(m => m.HOME_ROUTES),
    },
    { path: '', pathMatch: 'full', redirectTo: 'chat' },
    { path: '**', redirectTo: 'chat' },
];

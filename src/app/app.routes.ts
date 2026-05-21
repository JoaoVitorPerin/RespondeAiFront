import { Routes } from '@angular/router';
import { ChatComponent } from './modules/chat/chat.component';
import { authGuard } from '../shared/guards/authGuard';
import { redirectRootGuard } from '../shared/guards/redirectRootGuard';

export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full',
        canActivate: [redirectRootGuard],
        children: [] 
    },
    {
        path: 'auth',
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
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/home/home.routes').then(m => m.HOME_ROUTES),
    },
    {
        path: 'base-conhecimento',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/base-conhecimento/base-conhecimento.routes').then(m => m.BASE_CONHECIMENTO_ROUTES),
    },
    {
        path: 'configuracoes',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/configuracoes/configuracoes.routes').then(m => m.CONFIGURACOES_ROUTES),
    },
    { path: '**', redirectTo: 'auth/login' },
];

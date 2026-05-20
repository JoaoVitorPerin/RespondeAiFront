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
        path: 'relatorios',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/relatorios/relatorios.routes').then(m => m.RELATORIOS_ROUTES),
    },
    {
        path: 'configuracoes',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/configuracoes/configuracoes.routes').then(m => m.CONFIGURACOES_ROUTES),
    },
    { path: '', pathMatch: 'full', redirectTo: 'chat' },
    { path: '**', redirectTo: 'chat' },
];

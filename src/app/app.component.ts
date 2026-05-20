import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ToastrComponent } from '../shared/components/toastr/toastr.component';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { MenuItem, SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { TokenService } from '../shared/services/token.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ToastrComponent,
    LoaderComponent,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly tokenService = inject(TokenService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private destroy$ = new Subject<void>();

  isShowSideBar = false;
  sidebarOpen = true;

  // Rotas onde o sidebar deve ser exibido
  private routesWithSidebar = ['home', 'base-conhecimento', 'relatorios', 'configuracoes'];

  menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      route: '/home'
    },
    {
      id: 'base-conhecimento',
      label: 'Base de Conhecimento',
      icon: '📚',
      route: '/base-conhecimento'
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: '⚙️',
      route: '/configuracoes'
    },
    {
      id: 'sair',
      label: 'Sair',
      icon: '🚪',
      action: () => this.logout()
    }
  ];

  ngOnInit(): void {
    this.checkSideBarHidden();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkSideBarHidden();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkSideBarHidden(): void {
    const token = localStorage.getItem('token');
    const currentRoute = this.router.url.split('/')[1]; // Pega a primeira rota (ex: 'home', 'chat', etc)

    this.isShowSideBar =
      !!token &&
      token !== '{}' &&
      token !== 'null' &&
      token !== 'undefined' &&
      this.routesWithSidebar.includes(currentRoute);

    console.log('isShowSideBar', this.isShowSideBar);
  }

  logout(): void {
    this.tokenService.clearToken();
    this.isShowSideBar = false;
    this.router.navigate(['/login']);
  }

  onMenuItemClick(item: MenuItem): void {
    console.log('Menu item clicado:', item.label);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
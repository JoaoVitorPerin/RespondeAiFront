import { TokenService } from './../../../shared/services/token.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomeComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  constructor() { }

  ngOnInit() {
  }

  gerarLink() {
    const user = JSON.parse(this.tokenService.getUser());

    const link = `${window.location.origin}/chat/${user.chatHash}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copiado para a área de transferência!');
    }, (err) => {
      alert('Erro ao copiar o link: ' + err);
    });
  }

}

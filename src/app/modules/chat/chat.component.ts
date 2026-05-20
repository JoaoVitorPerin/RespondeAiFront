import { ApiChatService } from './../../../shared/services/apiChat.service';
import { TokenService } from './../../../shared/services/token.service';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../../shared/interfaces/chatMessage';
import { RoomDTO } from '../../../shared/interfaces/room';
import { Subscription } from 'rxjs';
import { AsiderBarSalasComponent } from './asider-bar-salas/asider-bar-salas.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { SideBarMembrosComponent } from './side-bar-membros/side-bar-membros.component';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [
    CommonModule, 
    FormsModule,
    ChatBoxComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly tokenService = inject(TokenService);
  private readonly apiChatService = inject(ApiChatService);

  nomeCompleto = '';
  numeroTelefone = '';
  isModalUsuarioOpen = true;

  hashChatPolitico = '';
  dadosPolitico: any = null;

  text = '';

  @ViewChild('list') list?: ElementRef<HTMLDivElement>;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    if(localStorage.getItem('usuarioSalvo')) {
      this.isModalUsuarioOpen = false;

      const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioSalvo')!);
      this.nomeCompleto = usuarioSalvo.nomeCompleto;
      this.numeroTelefone = usuarioSalvo.numeroTelefone;
    }

    this.buscarDadosPolitico();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private scrollBottom() {
    if (!this.list) return;
    this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
  }

  buscarDadosPolitico(){
    this.hashChatPolitico = window.location.pathname.split('/').pop() || '';
    if(this.hashChatPolitico) {
      this.apiChatService.buscarDadosPolitico(this.hashChatPolitico).subscribe({
        next: (dados) => {
          this.dadosPolitico = dados;
          console.log('Dados do político:', this.dadosPolitico);
        }
      });
    }
  }

  salvarUsuario() {
    localStorage.setItem('usuarioSalvo', JSON.stringify({
      nomeCompleto: this.nomeCompleto,
      numeroTelefone: this.numeroTelefone
    }));
    
    this.isModalUsuarioOpen = false;
  }

  closeModal() {
    this.isModalUsuarioOpen = false;
  }

  // Valida o nome em tempo real - apenas letras e espaços, máximo 40 caracteres
  validarNome(event: any): void {
    let valor = event.target.value;
    
    // Remove números e símbolos, mantém apenas letras e espaços
    let nomeValidado = valor.replace(/[^a-záéíóúâêôãõçA-ZÁÉÍÓÚÂÊÔÃÕÇ\s ]/g, '');
    
    // Limita a 40 caracteres
    nomeValidado = nomeValidado.substring(0, 40);
    
    // Atualiza o valor do input e do componente
    event.target.value = nomeValidado;
    this.nomeCompleto = nomeValidado;
  }

  // Formata o telefone em tempo real para (xx) xxxxx-xxxx com máximo 11 dígitos
  formatarTelefone(event: any): void {
    let valor = event.target.value;
    
    // Remove tudo que não é número
    let numeroLimpo = valor.replace(/\D/g, '');
    
    // Limita a 11 dígitos (padrão brasileiro)
    numeroLimpo = numeroLimpo.substring(0, 11);
    
    // Aplica a formatação (xx) xxxxx-xxxx
    let telefonFormatado = '';
    if (numeroLimpo.length > 0) {
      if (numeroLimpo.length <= 2) {
        telefonFormatado = numeroLimpo.length === 1 ? `(${numeroLimpo}` : `(${numeroLimpo}`;
      } else if (numeroLimpo.length <= 7) {
        telefonFormatado = `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2)}`;
      } else {
        telefonFormatado = `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 7)}-${numeroLimpo.substring(7, 11)}`;
      }
    }
    
    // Atualiza o valor do input e do componente
    event.target.value = telefonFormatado;
    this.numeroTelefone = telefonFormatado;
  }
}


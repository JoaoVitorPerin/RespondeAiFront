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
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ChatMessage } from '../../../../shared/interfaces/chatMessage';
import { SocketService } from '../../../../shared/services/socket.service';
import { RoomDTO } from '../../../../shared/interfaces/room';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/components/toastr/toastr.service';
import { Subscription } from 'rxjs';
import { ApiChatService } from '../../../../shared/services/apiChat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ChatBoxComponent implements OnInit {
  private readonly apiChatService = inject(ApiChatService);
  private readonly toastService = inject(ToastService);

  @Input() nomeCompleto: string = '';
  @Input() numeroTelefone: string = '';
  @Input() dadosPolitico: any = null;

  textoMensagem = '';
  messages: any[] = [];
  showScrollToTop = false;
  exibirLoader = false;

  subs: Subscription[] = [];

  ngOnInit(): void {
    this.apiChatService.buscarMensagens(this.numeroTelefone).subscribe({
      next: (res) => {
        this.messages = res.map((m: any) => ({
          text: m.content,
          sender: m.role === 'user' ? 'user' : 'assistant'
        }));
        setTimeout(() => {
          const list = document.getElementById('message-list');
          if (list) {
            list.scrollTop = list.scrollHeight;
          }
        }, 100);
      },
      error: (err) => {
        this.toastService.show('error', 'Erro ao carregar mensagens. Tente novamente.');
      }
    });
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onMessageListScroll(event: Event) {
    const element = event.target as HTMLElement;
    // Mostrar botão quando não estiver no final
    this.showScrollToTop = element.scrollHeight - element.scrollTop - element.clientHeight > 100;
  }

  scrollToBottom() {
    const messageList = document.getElementById('message-list');
    if (messageList) {
      messageList.scrollTo({ top: messageList.scrollHeight, behavior: 'smooth' });
    }
  }

  sendMessage(evento: Event) {
    evento.preventDefault();
    const msg = this.textoMensagem.trim();
    if (!msg) return;

    this.exibirLoader = true;

    this.messages.push({
      text: msg,
      sender: 'user'
    });

    this.apiChatService.mensagem({
      phone: this.numeroTelefone,
      mensagem: msg,
      idPolitico: this.dadosPolitico.id
    }).subscribe({
      next: (res) => {
        this.messages.push({
          text: res.resposta,
          sender: 'assistant'
        });

        setTimeout(() => {
          const list = document.getElementById('message-list');
          if (list) {
            list.scrollTop = list.scrollHeight;
          }
        }, 100);
      },
      error: (err) => {
        this.toastService.show('error', 'Erro ao enviar mensagem. Tente novamente.');
      },
      complete: () => {
        this.exibirLoader = false;
      }
    });
    this.textoMensagem = '';
  }
}

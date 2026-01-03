import { TokenService } from './../../../shared/services/token.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../shared/services/socket.service';
import { ChatMessage } from '../../../shared/interfaces/chatMessage';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  roomId = 'geral';
  userName = 'Você';
  text = '';
  messages: ChatMessage[] = [];

  @ViewChild('list') list!: ElementRef<HTMLDivElement>;

  constructor(
    private socket: SocketService,
    private tokenService: TokenService
  ) {
    this.userName = this.tokenService.getUser().name || 'Você';
    this.socket.connect();
    this.socket.joinRoom(this.roomId, this.userName);

    this.socket.onNewMessage().subscribe(m => {
      this.messages.push(m);
      setTimeout(() => this.scrollBottom());
    });

    this.socket.onSystem().subscribe(ev => {
      this.messages.push({
        id: 'sys',
        roomId: this.roomId,
        userName: 'Sistema',
        text: ev.text,
        ts: ev.ts
      });
    });
  }

  send() {
    if (!this.text.trim()) return;
    this.socket.sendMessage(this.roomId, this.userName, this.text);
    this.text = '';
  }

  private scrollBottom() {
    this.list.nativeElement.scrollTop =
      this.list.nativeElement.scrollHeight;
  }
}

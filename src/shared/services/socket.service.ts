import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatMessage } from '../interfaces/chatMessage';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  connect() {
    if (this.socket?.connected) return;
    this.socket = io("http://localhost:3000", {
      auth: { token: localStorage.getItem("token") }
    });
  }

  joinRoom(roomId: string, userName: string) {
    this.socket.emit('joinRoom', { roomId, userName });
  }

  sendMessage(roomId: string, userName: string, text: string) {
    this.socket.emit('message', { roomId, userName, text });
  }

  onNewMessage(): Observable<ChatMessage> {
    return new Observable((sub) => {
      this.socket.on('message:new', (msg: ChatMessage) => sub.next(msg));
      return () => this.socket.off('message:new');
    });
  }

  onSystem(): Observable<{ text: string; ts: number }> {
    return new Observable((sub) => {
      this.socket.on('system', (ev) => sub.next(ev));
      return () => this.socket.off('system');
    });
  }
}

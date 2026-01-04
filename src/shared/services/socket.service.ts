import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { RoomDTO } from '../interfaces/room';
import { ChatMessage } from '../interfaces/chatMessage';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket?: Socket;
  private readonly URL = 'http://localhost:3000';

  constructor(private token: TokenService, private zone: NgZone) {}

  connect() {
    if (this.socket?.connected) return;

    const token = this.token.getToken();
    this.socket = io(this.URL, { auth: { token } });

    this.socket.on('connect', () => console.log('✅ socket conectado', this.socket?.id));
    this.socket.on('connect_error', (e) => console.error('❌ socket connect_error', e?.message || e));
  }

  // ---------- SALAS ----------
  listRooms() {
    this.socket?.emit('rooms:list');
  }

  onRoomsList(): Observable<RoomDTO[]> {
    return new Observable(sub => {
      const handler = (rooms: RoomDTO[]) => this.zone.run(() => sub.next(rooms));
      this.socket?.on('rooms:list:result', handler);
      return () => this.socket?.off('rooms:list:result', handler);
    });
  }

  createRoom(name: string) {
    this.socket?.emit('room:create', { name });
  }

  onCreateRoomResult(): Observable<{ ok: boolean; roomId?: string; message?: string }> {
    return new Observable(sub => {
      const handler = (res: any) => this.zone.run(() => sub.next(res));
      this.socket?.on('room:create:result', handler);
      return () => this.socket?.off('room:create:result', handler);
    });
  }

  // ---------- CHAT ----------
  joinRoom(roomId: string) {
    this.socket?.emit('joinRoom', { roomId });
  }

  sendMessage(roomId: string, text: string) {
    this.socket?.emit('message', { roomId, text });
  }

  onNewMessage(): Observable<ChatMessage> {
    return new Observable(sub => {
      const handler = (m: ChatMessage) => this.zone.run(() => sub.next(m));
      this.socket?.on('message:new', handler);
      return () => this.socket?.off('message:new', handler);
    });
  }

  onSystem(): Observable<{ text: string; ts: number }> {
    return new Observable(sub => {
      const handler = (ev: any) => this.zone.run(() => sub.next(ev));
      this.socket?.on('system', handler);
      return () => this.socket?.off('system', handler);
    });
  }
}

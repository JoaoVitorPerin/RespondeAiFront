import { TokenService } from './../../../shared/services/token.service';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../shared/services/socket.service';
import { ChatMessage } from '../../../shared/interfaces/chatMessage';
import { RoomDTO } from '../../../shared/interfaces/room';
import { Subscription } from 'rxjs';
import { AsiderBarSalasComponent } from './asider-bar-salas/asider-bar-salas.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [
    CommonModule, 
    FormsModule,
    AsiderBarSalasComponent,
    ChatBoxComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly socketService = inject(SocketService);
  private readonly tokenService = inject(TokenService);

  userName = 'Você';

  rooms: RoomDTO[] = [];
  selectedRoom: RoomDTO | null = null;

  text = '';
  nomeSala = '';

  private messagesByRoom = new Map<string, ChatMessage[]>();

  // getter pro template
  get messages(): ChatMessage[] {
    if (!this.selectedRoom) return [];
    return this.messagesByRoom.get(this.selectedRoom.id) ?? [];
  }


  @ViewChild('list') list?: ElementRef<HTMLDivElement>;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.userName = this.tokenService.getUser()?.name || 'Você';

    this.socketService.connect();

    this.socketService.listRooms();

    this.subs.push(
      this.socketService.onRoomsList().subscribe((rooms) => {
        this.rooms = rooms;

        if (this.selectedRoom && !rooms.some(r => r.id === this.selectedRoom!.id)) {
          this.selectedRoom = null;
          this.text = '';
        }
      })
    );

    // mensagens novas: entram no map da sala certa
    this.subs.push(
      this.socketService.onNewMessage().subscribe((m) => {
        const arr = this.messagesByRoom.get(m.roomId) ?? [];
        arr.push(m);
        this.messagesByRoom.set(m.roomId, arr);

        // se mensagem for da sala aberta, scroll
        if (this.selectedRoom?.id === m.roomId) {
          setTimeout(() => this.scrollBottom());
        }
      })
    );

    // system message: também por sala (se tiver roomId use, se não tiver joga na sala atual)
    this.subs.push(
      this.socketService.onSystem().subscribe((ev) => {
        const roomId = this.selectedRoom?.id;
        if (!roomId) return; // sem sala selecionada, ignora

        const arr = this.messagesByRoom.get(roomId) ?? [];

        this.messagesByRoom.set(roomId, arr);

        setTimeout(() => this.scrollBottom());
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  selectRoom(room: RoomDTO) {
    this.selectedRoom = room;

    if (!this.messagesByRoom.has(room.id)) {
      this.messagesByRoom.set(room.id, []);
    }

    this.socketService.joinRoom(room.id);

    this.text = '';
    setTimeout(() => this.scrollBottom());
  }

  private scrollBottom() {
    if (!this.list) return;
    this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
  }

  deletarSala(room: RoomDTO) {
    if (!room) return;
    
    this.rooms = this.rooms.filter(r => r.id !== this.selectedRoom!.id);
    this.selectedRoom = null;
  }
}

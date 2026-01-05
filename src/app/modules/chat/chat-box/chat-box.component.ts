import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ChatMessage } from '../../../../shared/interfaces/chatMessage';
import { SocketService } from '../../../../shared/services/socket.service';
import { RoomDTO } from '../../../../shared/interfaces/room';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/components/toastr/toastr.service';
import { Subscription } from 'rxjs';

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
  private readonly socketService = inject(SocketService);
  private readonly toastService = inject(ToastService);

  @Input() userName: string = '';
  @Input() selectedRoom: RoomDTO | null = null;
  @Input() messages: ChatMessage[] = [];
  @Input() rooms: RoomDTO[] = [];

  nomeSala: string = '';
  emailMembro: string = '';
  membrosSala: string[] = [];
  text: string = '';

  isModalEditarOpen = false;
  isModalDeletarSalaOpen = false;
  isModalSairSalaOpen = false;

  subs: Subscription[] = [];

  @Output() deletarSalaEvent = new EventEmitter<RoomDTO>();

  ngOnInit(): void {
    this.subs.push(
      this.socketService.onRemoveMemberFromRoom().subscribe((res) => {
        if (!res.ok) {
          this.toastService.error(res.message || 'Erro ao sair da sala.');
          return;
        }

        this.toastService.success('Você saiu da sala com sucesso.');
        this.isModalSairSalaOpen = false;
      })
    );
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  openModalEditarSala(nomeSalaEdicao: string) {
    this.nomeSala = nomeSalaEdicao || '';
    this.membrosSala = this.selectedRoom!.members.map(m => m.email && m.role !== 'ADMIN' ? m.email : '').filter(email => email);
    this.isModalEditarOpen = true;
  }

  openModalDeletarSala() {
    this.isModalDeletarSalaOpen = true;
  }

  openModalSairSala() {
    this.isModalSairSalaOpen = true;
  }

  closeModal() {
    this.nomeSala = '';
    this.isModalEditarOpen = false;
    this.isModalDeletarSalaOpen = false;
    this.isModalSairSalaOpen = false;
    this.membrosSala = [];
    this.emailMembro = '';
  }

  deletarSala() {
    if (!this.selectedRoom) return;
    
    this.socketService.deleteRoom(this.selectedRoom.id);
    this.closeModal();
    this.deletarSalaEvent.emit(this.selectedRoom);
  }

  sairDaSala() {
    if (!this.selectedRoom) return;

    this.socketService.removeMemberFromRoom(this.selectedRoom.id, this.userName);
  }

  editarSala(){
    if (!this.selectedRoom) return;
    
    const name = this.nomeSala.trim();
    if (!name) return;

    this.socketService.editRoom(this.selectedRoom.id, name, this.membrosSala);
    this.closeModal();
    this.selectedRoom.name = name;
  }

  sendMessage() {
    if (!this.selectedRoom) return;
    const msg = this.text.trim();
    if (!msg) return;

    this.socketService.sendMessage(this.selectedRoom.id, msg);
    this.text = '';
  }

  adicionarMembroSala(){
    const email = this.emailMembro.trim();

    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.toastService.error('Digite um email válido.');
      return;
    }

    this.membrosSala.push(email);
    this.emailMembro = '';
  }

  removerMembroSala(email: string) {
    this.membrosSala = this.membrosSala.filter(m => m !== email);
  }
}

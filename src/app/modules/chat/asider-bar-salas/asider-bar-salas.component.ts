import { ToastService } from './../../../../shared/components/toastr/toastr.service';
import { LoaderService } from './../../../../shared/components/loader/loader.service';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RoomDTO } from '../../../../shared/interfaces/room';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../../shared/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asider-bar-salas',
  templateUrl: './asider-bar-salas.component.html',
  styleUrls: ['./asider-bar-salas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class AsiderBarSalasComponent implements OnInit, OnDestroy {
  private readonly socketService = inject(SocketService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  @Input() rooms: RoomDTO[] = [];
  @Input() selectedRoom: RoomDTO | null = null;

  isModalAdicionarSalaOpen = false;
  nomeSala: string = '';
  emailMembro: string = '';
  subs: Subscription[] = [];
  membrosSala: string[] = [];

  @Output() roomSelected = new EventEmitter<RoomDTO>();

  ngOnInit(): void {
    this.subs.push(
      this.socketService.onCreateRoomResult().subscribe((res) => {
        if (!res.ok) {
          this.toastService.error(res.message || 'Erro ao criar sala.');
          this.loaderService.hideManual();
          return;
        }

        this.nomeSala = '';
        this.isModalAdicionarSalaOpen = false;
        this.membrosSala = [];
        this.emailMembro = '';
        this.loaderService.hideManual();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  selectRoom(room: RoomDTO) {
    this.roomSelected.emit(room);
  }

  openModalAdicionarSala() {
    this.isModalAdicionarSalaOpen = true;
  }

  closeModalAdicionarSala() {
    this.nomeSala = '';
    this.isModalAdicionarSalaOpen = false;
  }

  adicionarSala() {
    const name = this.nomeSala.trim();
    if (!name) return;
    this.socketService.createRoom(name, this.membrosSala);
    this.loaderService.showManual();
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

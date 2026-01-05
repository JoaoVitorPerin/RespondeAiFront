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

  @Input() rooms: RoomDTO[] = [];
  @Input() selectedRoom: RoomDTO | null = null;

  isModalAdicionarSalaOpen = false;
  nomeSala: string = '';
  subs: Subscription[] = [];

  @Output() roomSelected = new EventEmitter<RoomDTO>();

  ngOnInit(): void {
    this.subs.push(
      this.socketService.onCreateRoomResult().subscribe((res) => {
        if (!res.ok) {
          alert(res.message || 'Erro ao criar sala');
          return;
        }

        this.nomeSala = '';
        this.isModalAdicionarSalaOpen = false;
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
    this.socketService.createRoom(name);
    this.loaderService.showManual();
  }
}

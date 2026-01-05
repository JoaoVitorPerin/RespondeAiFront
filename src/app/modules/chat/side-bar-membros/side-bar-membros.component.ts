import { Component, input, OnInit } from '@angular/core';
import { RoomDTO } from '../../../../shared/interfaces/room';

@Component({
  selector: 'app-side-bar-membros',
  templateUrl: './side-bar-membros.component.html',
  styleUrls: ['./side-bar-membros.component.scss']
})
export class SideBarMembrosComponent implements OnInit {
  selectedRoom = input<RoomDTO | null>(null);

  ngOnInit() {
    console.log('Selected Room:', this.selectedRoom());
  }

}

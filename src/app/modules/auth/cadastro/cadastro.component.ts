import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit() {
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}

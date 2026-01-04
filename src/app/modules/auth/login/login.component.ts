import { ToastService } from './../../../../shared/components/toastr/toastr.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../../../shared/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../../shared/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class LoginComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly autenticacaoService = inject(AutenticacaoService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);

  formLogin: FormGroup = new FormGroup({});

  ngOnInit() {
    localStorage.clear();
    this.formLogin = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  navigateToCadastro() {
    this.router.navigate(['/cadastro']);
  }

  login(){
    this.autenticacaoService.login(this.formLogin.getRawValue()).subscribe({
      next: (response) => {
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);
      },
      error: (error) => {
        this.toastService.error(error.error.message || 'Erro ao efetuar login');
      },
      complete: () => {
        this.router.navigate(['/chat']);
      }
    });
  }

}

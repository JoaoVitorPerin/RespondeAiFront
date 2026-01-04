import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../../../shared/services/auth.service';
import { TokenService } from '../../../../shared/services/token.service';
import { ToastService } from '../../../../shared/components/toastr/toastr.service';
import { confirmPasswordValidator, validatorSenhaForte } from '../../../../shared/validators/validatorForm';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class CadastroComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly autenticacaoService = inject(AutenticacaoService);
  private readonly tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);

  formCadastro: FormGroup = new FormGroup({});

  ngOnInit() {
    localStorage.clear();
    this.formCadastro = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },
    { 
      validators: [confirmPasswordValidator] 
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  cadastro(){
    this.autenticacaoService.cadastro(this.formCadastro.getRawValue()).subscribe({
      next: (response: any) => {
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);
        this.router.navigate(['/chat']);
        this.toastService.success('Cadastro realizado com sucesso!');
      },
      error: (error: any) => {
        this.toastService.error(error.error.message || 'Erro ao efetuar cadastro');
      },
    });
  }

}

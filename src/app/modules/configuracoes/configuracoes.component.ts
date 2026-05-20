import { ToastService } from './../../../shared/components/toastr/toastr.service';
import { ApiChatService } from './../../../shared/services/apiChat.service';
import { AutenticacaoService } from './../../../shared/services/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from './../../../shared/services/token.service';

interface ConfiguracaoUsuario {
  id: string;
  name: string;
  email: string;
  office: string;
  phone: string;
  party: string;
  vote_number: string;
  fotoPerfil: string;
}

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ConfiguracoesComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  private readonly autenticacaoService = inject(AutenticacaoService);
  private readonly apiChatService = inject(ApiChatService);
  private readonly toastService = inject(ToastService);

  formulario: ConfiguracaoUsuario = {
    id: '',
    name: '',
    email: '',
    office: '',
    phone: '',
    party: '',
    vote_number: '',
    fotoPerfil: ''
  };

  cargosDisponiveis = [
    'Vereador',
    'Deputado Estadual',
    'Deputado Federal',
    'Senador',
    'Prefeito',
    'Governador',
    'Presidente'
  ];

  fotoPreview: string | null = null;

  constructor() { }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    try {
      this.apiChatService.buscarDadosPolitico(JSON.parse(this.tokenService.getUser()).chatHash).subscribe({
        next: (response) => { 
          const usuario = response;
          console.log('Dados do usuário carregados:', usuario);
          this.preencherFormulario(usuario);
        },
        error: (error) => {
          console.error('Erro ao buscar dados do usuário:', error);
          this.toastService.show('error','Erro ao carregar dados do usuário. Tente recarregar a página.');
        }
      });
    } catch (error) {
      console.error('Erro ao processar token do usuário:', error);
      this.toastService.show('error','Erro ao carregar dados do usuário. Tente recarregar a página.');
    }
  }

  preencherFormulario(usuario: any) {
    this.formulario = {
      id: usuario.id || '',
      name: usuario.name || '',
      email: usuario.email || '',
      office: usuario.office || '',
      phone: usuario.phone || '',
      party: usuario.party || '',
      vote_number: usuario.vote_number || '',
      fotoPerfil: usuario.photo_url || ''
    };
    if (this.formulario.fotoPerfil) {
      this.fotoPreview = this.formulario.fotoPerfil;
    }
  }

  onFotoSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
        this.formulario.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  salvarConfiguracoes() {
    if (!this.formulario.name.trim()) {
      this.toastService.show('error','Nome é obrigatório');
      return;
    }

    if (!this.formulario.email.trim()) {
      this.toastService.show('error','Email é obrigatório');
      return;
    }

    if (!this.formulario.office.trim()) {
      this.toastService.show('error','Cargo é obrigatório');
      return;
    }

    this.autenticacaoService.editarUsuario(this.formulario, this.formulario.id).subscribe({
      next: (response) => {
        this.toastService.show('success','Configurações salvas com sucesso!');
      },
      error: (error) => {
        this.toastService.show('error','Erro ao salvar as configurações. Tente novamente.');
      }
    });

  }

}

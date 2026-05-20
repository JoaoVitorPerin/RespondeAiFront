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
  infoSectionExpanded = true;

  constructor() { }
  
  toggleInfoSection() {
    this.infoSectionExpanded = !this.infoSectionExpanded;
  }

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

    if (!this.isEmailValido(this.formulario.email)) {
      this.toastService.show('error','Email inválido');
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

  // Formata o telefone em tempo real para (xx) xxxxx-xxxx com máximo 11 dígitos
  formatarTelefone(event: any): void {
    let valor = event.target.value;
    
    // Remove tudo que não é número
    let numeroLimpo = valor.replace(/\D/g, '');
    
    // Limita a 11 dígitos (padrão brasileiro)
    numeroLimpo = numeroLimpo.substring(0, 11);
    
    // Aplica a formatação (xx) xxxxx-xxxx
    let telefonFormatado = '';
    if (numeroLimpo.length > 0) {
      if (numeroLimpo.length <= 2) {
        telefonFormatado = numeroLimpo.length === 1 ? `(${numeroLimpo}` : `(${numeroLimpo}`;
      } else if (numeroLimpo.length <= 7) {
        telefonFormatado = `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2)}`;
      } else {
        telefonFormatado = `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 7)}-${numeroLimpo.substring(7, 11)}`;
      }
    }
    
    // Atualiza o valor do input e do componente
    event.target.value = telefonFormatado;
    this.formulario.phone = telefonFormatado;
  }

  // Valida se o email é válido
  isEmailValido(email: string): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  // Monitora o input de email e valida em tempo real
  validarEmail(event: any): void {
    let valor = event.target.value;
    this.formulario.email = valor;
    
    // Opcional: você pode adicionar feedback visual aqui
    if (valor && !this.isEmailValido(valor)) {
      event.target.classList.add('is-invalid');
    } else {
      event.target.classList.remove('is-invalid');
    }
  }

}

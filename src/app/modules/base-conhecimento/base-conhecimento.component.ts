import { ToastService } from './../../../shared/components/toastr/toastr.service';
import { TokenService } from './../../../shared/services/token.service';
import { BaseConhecimentoService } from './../../../shared/services/baseConhecimento.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Conhecimento {
  id: string;
  titulo: string;
  conteudo: string;
}

interface ConhecimentoEdit {
  id: string;
  titulo: string;
  conteudo: string;
  expanded: boolean;
  editTitulo: string;
  editConteudo: string;
  isNew: boolean;
}

@Component({
  selector: 'app-base-conhecimento',
  templateUrl: './base-conhecimento.component.html',
  styleUrls: ['./base-conhecimento.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BaseConhecimentoComponent implements OnInit {
  private readonly baseConhecimentoService = inject(BaseConhecimentoService);
  private readonly tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);

  conhecimentos: ConhecimentoEdit[] = [];
  idPolitico = '';

  isModalConfirmacaoOpen = false;
  conhecimentoIdParaDeletar = '';

  constructor() { }

  ngOnInit() {
    this.idPolitico = JSON.parse(this.tokenService.getUser()).id;
    
    this.carregarConhecimentos();
  }

  carregarConhecimentos() {
    this.baseConhecimentoService.buscarConhecimentos(this.idPolitico).subscribe({
      next: (dados) => {
        this.conhecimentos = dados.map((conhecimento: any) => ({
          id: conhecimento.id,
          titulo: conhecimento.title,
          conteudo: conhecimento.content,
          expanded: false,
          editTitulo: conhecimento.title,
          editConteudo: conhecimento.content,
          isNew: false
        }));
      },
      error: (err) => {
        this.toastService.show('error', 'Não foi possível carregar os conhecimentos.');
      }
    });
  }

  toggleAcordion(conhecimento: ConhecimentoEdit) {
    conhecimento.expanded = !conhecimento.expanded;
    if (conhecimento.expanded) {
      conhecimento.editTitulo = conhecimento.titulo;
      conhecimento.editConteudo = conhecimento.conteudo;
    }
  }

  adicionarConhecimento() {
    const novoId = (Math.max(...this.conhecimentos.map(k => parseInt(k.id) || 0), 0) + 1).toString();
    const novo: ConhecimentoEdit = {
      id: novoId,
      titulo: 'Novo Conhecimento',
      conteudo: '',
      expanded: true,
      editTitulo: 'Novo Conhecimento',
      editConteudo: '',
      isNew: true
    };
    this.conhecimentos.unshift(novo);
  }

  cancelarEdicao(conhecimento: ConhecimentoEdit) {
    conhecimento.editTitulo = conhecimento.titulo;
    conhecimento.editConteudo = conhecimento.conteudo;
    conhecimento.expanded = false;
  }

  deletarConhecimento() {
    this.baseConhecimentoService.deletarConhecimento(this.conhecimentoIdParaDeletar, this.idPolitico).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Conhecimento deletado com sucesso.');
        this.carregarConhecimentos();
      },
      error: (err) => {
        this.toastService.show('error', 'Não foi possível deletar o conhecimento.');
      },
      complete: () => {
        this.isModalConfirmacaoOpen = false;
        this.conhecimentoIdParaDeletar = '';
      }
    });
  }

  editarConhecimento(conhecimento: ConhecimentoEdit) {
    conhecimento.titulo = conhecimento.editTitulo;
    conhecimento.conteudo = conhecimento.editConteudo;
    conhecimento.expanded = false;
    this.baseConhecimentoService.editarConhecimento(conhecimento.id, {
      title: conhecimento.titulo,
      content: conhecimento.conteudo
    }).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Conhecimento editado com sucesso.');
        this.carregarConhecimentos();
      },
      error: (err) => {
        this.toastService.show('error', 'Não foi possível editar o conhecimento.');
      }
    });
  }

  salvarConhecimento(conhecimento: ConhecimentoEdit) {
    conhecimento.titulo = conhecimento.editTitulo;
    conhecimento.conteudo = conhecimento.editConteudo;
    conhecimento.expanded = false;
    this.baseConhecimentoService.cadastrarConhecimento({
      title: conhecimento.titulo,
      content: conhecimento.conteudo
    }, this.idPolitico).subscribe({
      next: (response) => {
        this.toastService.show('success', 'Conhecimento salvo com sucesso.');
        this.carregarConhecimentos();
      },
      error: (err) => {
        this.toastService.show('error', 'Não foi possível salvar o conhecimento.');
      }
    });
  }

  abrirModalConfirmacao(conhecimentoId: string) {
    this.conhecimentoIdParaDeletar = conhecimentoId;
    this.isModalConfirmacaoOpen = !this.isModalConfirmacaoOpen;
  }
}

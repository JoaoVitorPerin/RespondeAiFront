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

  conhecimentos: ConhecimentoEdit[] = [];
  idPolitico = '';

  constructor() { }

  ngOnInit() {
    this.idPolitico = JSON.parse(this.tokenService.getUser()).id;
    console.log(this.tokenService.getUser());
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
        console.error('Erro ao carregar conhecimentos:', err);
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

  deletarConhecimento(id: string) {
    if (confirm('Tem certeza que deseja deletar este conhecimento?')) {
      this.baseConhecimentoService.deletarConhecimento(id, this.idPolitico).subscribe({
        next: (response) => {
          console.log('Conhecimento deletado com sucesso:', response);
          this.carregarConhecimentos();
        },
        error: (err) => {
          console.error('Erro ao deletar conhecimento:', err);
        }
      });
    }
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
        console.log('Conhecimento editado com sucesso:', response);
        this.carregarConhecimentos();
      },
      error: (err) => {
        console.error('Erro ao editar conhecimento:', err);
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
        console.log('Conhecimento salvo com sucesso:', response);
        this.carregarConhecimentos();
      },
      error: (err) => {
        console.error('Erro ao salvar conhecimento:', err);
      }
    });
  }
}

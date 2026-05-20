import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private readonly http = inject(HttpClient);
  private readonly headerService = inject(HeaderService);
  private readonly API_BACK = environment.API_BACK;

  private data: any;


  login(dados: any): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}auth/login`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  cadastro(dados: any): Observable<any> {
    this.data = {
      ...dados,
    };
    
    return this.http.post<any>(`${this.API_BACK}auth/cadastro`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }

  editarUsuario(dados: any, idPolitico: string): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.put<any>(`${this.API_BACK}politico/${idPolitico}`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }
}

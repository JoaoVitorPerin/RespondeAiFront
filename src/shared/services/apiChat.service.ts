import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class ApiChatService {
  private readonly http = inject(HttpClient);
  private readonly headerService = inject(HeaderService);
  private readonly API_BACK = environment.API_BACK;

  private data: any;


  mensagem(dados: any): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}mensagem`, this.data, {
      headers: this.headerService.getHeader().set('X-Skip-Loader', 'true'),
    });
  }

  buscarMensagens(numeroTelefone: string): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}mensagens/${numeroTelefone}`);
  }

  buscarDadosPolitico(hashPolitico: string): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}politico/${hashPolitico}`);
  }
}

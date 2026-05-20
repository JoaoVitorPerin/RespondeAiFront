import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class BaseConhecimentoService {
  private readonly http = inject(HttpClient);
  private readonly headerService = inject(HeaderService);
  private readonly API_BACK = environment.API_BACK;

  private data: any;


  cadastrarConhecimento(dados: any, politicoId: string): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}knowledge/${politicoId}`, this.data, {
      headers: this.headerService.getHeader().set('X-Skip-Loader', 'true'),
    });
  }

  deletarConhecimento(id: string, politicoId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_BACK}knowledge/${id}/${politicoId}`);
  }

  editarConhecimento(id: string, dados: any): Observable<any> {
    return this.http.put<any>(`${this.API_BACK}knowledge/${id}`, dados);
  }

  buscarConhecimentos(politicoId: string): Observable<any> {
    return this.http.get<any>(`${this.API_BACK}knowledge/${politicoId}`);
  }
}

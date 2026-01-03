import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private readonly API_BACK = environment.API_BACK;

  private data: any;
  
  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ) {
  }

  login(dados: any): Observable<any> {
    this.data = {
      ...dados,
    };

    return this.http.post<any>(`${this.API_BACK}auth/login`, this.data, {
      headers: this.headerService.getHeader(),
    });
  }
}

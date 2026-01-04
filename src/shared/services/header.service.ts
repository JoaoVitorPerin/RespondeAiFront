import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private readonly tokenService = inject(TokenService);
  data: any;

  private headers: HttpHeaders = new HttpHeaders();

  acesso: string = '';

  private buscarBreakingNews = new Subject<string>();
  buscarBreakingNews$ = this.buscarBreakingNews.asObservable();

  getHeader(adicionais? : any): any {

    if(this.tokenService?.getToken()?.access)
      this.acesso = `Bearer ${this.tokenService?.getToken() ? this.tokenService?.getToken()?.access : ''}`;

    this.headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: this.acesso,
      ...adicionais
    });

    return this.headers;
  }
}

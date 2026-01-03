import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  data: any;
  private readonly API = `${environment.API_BACK}`;

  private headers: HttpHeaders = new HttpHeaders();

  acesso: string = '';

  private buscarBreakingNews = new Subject<string>();
  buscarBreakingNews$ = this.buscarBreakingNews.asObservable();

  constructor(
    private tokenService: TokenService,
    private http: HttpClient
  ) {
  }

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

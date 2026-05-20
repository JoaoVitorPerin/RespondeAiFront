import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  data: any;
  readonly API_BACK: string = environment.API_BACK

  getToken(): any {
    return JSON.parse(localStorage.getItem('token') || '{}');
  }

  setToken(token: any): void {
    this.clearToken();
    localStorage.setItem('token', JSON.stringify(token));
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getJwtDecodedAccess(): any {
    try {
      return jwtDecode(this.getToken().access);
    }
    catch (error) {
      //
    }
  }

  getJwtDecodedRefresh(): any {
    try {
      return jwtDecode(this.getToken().refresh);
    }
    catch (error) {
      //
    }
  }

}

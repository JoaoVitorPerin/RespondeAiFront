import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly headerService = inject(HeaderService);
  private readonly API_BACK = environment.API_BACK;

  private data: any;


  upload(image: File): Observable<any> {
    
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post<any>(`${this.API_BACK}upload`, formData);
  }
}

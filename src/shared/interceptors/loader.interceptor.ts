import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../components/loader/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private readonly SKIP_HEADER = 'X-Skip-Loader';

  private readonly loaderService = inject(LoaderService);


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('[LoaderInterceptor] interceptou:', req.url);
    const skip = req.headers.has(this.SKIP_HEADER);

    const request = skip ? req.clone({ headers: req.headers.delete(this.SKIP_HEADER) }) : req;

    if (!skip) this.loaderService.show();

    return next.handle(request).pipe(
      finalize(() => {
        if (!skip) this.loaderService.hide();
      })
    );
  }
}

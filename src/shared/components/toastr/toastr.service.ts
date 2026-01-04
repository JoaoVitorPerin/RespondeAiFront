import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastItem, ToastType } from '../../interfaces/toastMessage';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new Subject<Omit<ToastItem, 'id'>>();
  toast$ = this.subject.asObservable();

  show(type: ToastType, message: string) {
    this.subject.next({ type, message });
  }

  success(message: string) { this.show('success', message); }
  info(message: string)    { this.show('info', message); }
  warning(message: string) { this.show('warning', message); }
  error(message: string)   { this.show('error', message); }
}

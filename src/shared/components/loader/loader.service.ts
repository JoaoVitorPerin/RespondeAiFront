import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private counter = 0;

  private manualCounter = 0;

  private visibleSubject = new BehaviorSubject<boolean>(false);
  visible$ = this.visibleSubject.asObservable();

  show() {
    this.counter++;
    this.emit();
  }

  hide() {
    this.counter = Math.max(0, this.counter - 1);
    this.emit();
  }

  // Manual (pra telas específicas / fluxos)
  showManual() {
    this.manualCounter++;
    this.emit();
  }

  hideManual() {
    this.manualCounter = Math.max(0, this.manualCounter - 1);
    this.emit();
  }

  resetAll() {
    this.counter = 0;
    this.manualCounter = 0;
    this.emit();
  }

  private emit() {
    this.visibleSubject.next((this.counter + this.manualCounter) > 0);
  }
}

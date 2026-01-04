import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from './toastr.service';
import { ToastItem, ToastType } from '../../interfaces/toastMessage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ToastrComponent implements OnInit, OnDestroy {
  private readonly toastService = inject(ToastService);
  toasts: (ToastItem & { leaving?: boolean })[] = [];
  private sub?: Subscription;

  private readonly durationMs = 3000;
  private readonly exitAnimMs = 250;


  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe(t => this.addToast(t.type, t.message));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private addToast(type: ToastType, message: string) {
    const id = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

    const toast: ToastItem & { leaving?: boolean } = { id, type, message };
    this.toasts.push(toast);

    // some após 3s (com animação de saída)
    setTimeout(() => this.dismiss(id), this.durationMs);
  }

  dismiss(id: string) {
    const toast = this.toasts.find(t => t.id === id);
    if (!toast || toast.leaving) return;

    toast.leaving = true; // ativa classe de saída
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, this.exitAnimMs);
  }

  trackById(_: number, t: ToastItem) {
    return t.id;
  }
}

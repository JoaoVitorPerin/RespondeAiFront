import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  private readonly loaderService = inject(LoaderService);
  visible = false;
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.loaderService.visible$.subscribe(v => (this.visible = v));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

import { ToastService } from './../../../shared/components/toastr/toastr.service';
import { TokenService } from './../../../shared/services/token.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomeComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  private toastService = inject(ToastService);
  
  @ViewChild('qrcodeCanvas') qrcodeCanvas!: ElementRef<HTMLCanvasElement>;

  linkChat = '';
  qrcodeGerado = false;

  constructor() { }

  ngOnInit() {
    this.gerarQRCode();
  }

  gerarQRCode() {
    const user = JSON.parse(this.tokenService.getUser());
    this.linkChat = `${window.location.origin}/chat/${user.chatHash}`;
    
    setTimeout(() => {
      if (this.qrcodeCanvas) {
        QRCode.toCanvas(
          this.qrcodeCanvas.nativeElement,
          this.linkChat,
          {
            width: 250,
            margin: 2,
            color: {
              dark: '#0d1014',
              light: '#ffffff'
            }
          },
          (error: any) => {
            if (error) {
              this.toastService.show('error','Erro ao gerar QR Code');
            } else {
              this.qrcodeGerado = true;
            }
          }
        );
      }
    }, 100);
  }

  baixarQRCode() {
    if (this.qrcodeCanvas) {
      const link = document.createElement('a');
      link.href = this.qrcodeCanvas.nativeElement.toDataURL('image/png');
      link.download = 'qrcode-chat.png';
      link.click();
    }
  }

  copiarLink() {
    navigator.clipboard.writeText(this.linkChat).then(() => {
      this.toastService.show('success','Link copiado para a área de transferência!');
    }, (err) => {
      this.toastService.show('error','Erro ao copiar o link: ' + err);
    });
  }

}

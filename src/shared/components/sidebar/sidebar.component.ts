import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  action?: () => void;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() items: MenuItem[] = [];
  @Input() isOpen = true;
  @Output() itemClicked = new EventEmitter<MenuItem>();
  @Output() toggle = new EventEmitter<void>();

  expandedItems: Set<string> = new Set();

  ngOnInit(): void {
    // Inicializar com itens já expandidos se necessário
  }

  toggleExpand(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      if (this.expandedItems.has(item.id)) {
        this.expandedItems.delete(item.id);
      } else {
        this.expandedItems.add(item.id);
      }
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.id);
  }

  onItemClick(item: MenuItem): void {
    if (item.action) {
      item.action();
    }
    this.itemClicked.emit(item);
  }

  toggleSidebar(): void {
    this.toggle.emit();
  }
}

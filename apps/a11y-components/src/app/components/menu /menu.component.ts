import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  isOpen?: boolean;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-components-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @ViewChild('menuButton') menuButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  isOpen = false;
  menuItems = [
    { label: 'Home', isOpen: false },
    { label: 'About', isOpen: false },
    { label: 'Services', isOpen: false, submenu: [
        { label: 'Web Design' },
        { label: 'SEO' }
      ] },
    { label: 'Contact', isOpen: false }
  ];

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.menu?.nativeElement.focus(), 0);
    }
  }

  selectItem(item: any): void {
    console.log('Selected:', item.label);
    this.isOpen = false;
  }

  onSelectItem(event: KeyboardEvent, item: any): void {
    event.preventDefault();
    this.selectItem(item);
  }

  toggleSubmenu(item: MenuItem): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if(item?.submenu?.length > 0) {
      item.isOpen = !item.isOpen;
    } else {
      this.selectItem(item);
    }
  }

  openSubmenu(item: any): void {
    if (item.submenu) {
      item.isOpen = true;
    }
  }

  closeSubmenu(item: any): void {
    if (item.submenu) {
      item.isOpen = false;
    }
  }

  closeSubmenuAndFocus(item: any, event: KeyboardEvent): void {
    event.preventDefault();
    this.closeSubmenu(item);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setTimeout(() => event.currentTarget['parentElement']['parentElement']?.focus(), 0);
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    if (
      this.isOpen &&
      !this.menuButton.nativeElement.contains(event.target) &&
      !this.menu.nativeElement.contains(event.target)
    ) {
      this.isOpen = false;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.menu.nativeElement.querySelectorAll('li');
    let index = Array.from(items).indexOf(document.activeElement as HTMLElement);
    if (event.key === 'ArrowDown') {
      index = (index + 1) % items.length;
      items[index].focus();
    } else if (event.key === 'ArrowUp') {
      index = (index - 1 + items.length) % items.length;
      items[index].focus();
    } else if (event.key === 'Escape') {
      this.isOpen = false;
      this.menuButton.nativeElement.focus();
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../menu.component';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuListComponent {
  @ViewChild('menuTrigger')
  menuTrigger!: ElementRef;

  @ViewChild('menu')
  menu!: ElementRef;

  @Input()
  menuItems: MenuItem[] = [];

  @Input()
  isOpen = false;

  @Output()
  openChange = new EventEmitter<boolean>();

  protected onListItemKeyDown(event: KeyboardEvent, item: MenuItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      if(item?.submenu?.length != undefined) {
        if(item?.submenu?.length > 0) {
          item.isOpen = !item.isOpen;
        }
      } else {
        this.selectItem();
      }
    } else if (event.key === 'Escape') {
      this.isOpen = false;
      this.menuTrigger.nativeElement.focus();
    }
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
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
      this.menuTrigger.nativeElement.focus();
    }
  }

  protected selectItem(): void {
    this.isOpen = false;
    this.openChange.emit(false);
  }

  protected onListItemClick(event: any, item: MenuItem): void {
    event.preventDefault();
    if(item?.submenu?.length != undefined) {
      if(item?.submenu?.length > 0) {
        item.isOpen = !item.isOpen;
      }
    } else {
      this.selectItem();
    }
  }
}

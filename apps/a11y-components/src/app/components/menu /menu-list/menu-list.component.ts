import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../menu.component';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <ul
        role="menu"
        tabindex="-1"
        (keydown)="onMenuKeydown($event)"
      >
        @for (item of menuItems(); track item.label) {
          <li
            role="menuitem"
            tabindex="0"
            (click)="onListItemClick($event,item)"
            (keydown)="onListItemKeyDown($event, item)"
            [attr.aria-haspopup]="item.submenu ? 'true' : null"
            [attr.aria-expanded]="item.isOpen ? 'true' : null"
          >
            {{ item.label }}
            @if (item.submenu) {
              <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.3153 16.6681C15.9247 17.0587 15.9247 17.6918 16.3153 18.0824C16.7058 18.4729 17.339 18.4729 17.7295 18.0824L22.3951 13.4168C23.1761 12.6357 23.1761 11.3694 22.3951 10.5883L17.7266 5.9199C17.3361 5.52938 16.703 5.52938 16.3124 5.91991C15.9219 6.31043 15.9219 6.9436 16.3124 7.33412L19.9785 11.0002L2 11.0002C1.44772 11.0002 1 11.4479 1 12.0002C1 12.5524 1.44772 13.0002 2 13.0002L19.9832 13.0002L16.3153 16.6681Z" fill="#0F0F0F"/>
              </svg>
            }
            @if (item.isOpen && item.submenu) {
              <app-menu-list
                class="submenu"
                [open]=item.isOpen
                [menuItems]="item.submenu"
              />
            }
          </li>
        }
      </ul>
    }`,
  styleUrl: './menu-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuListComponent {
  menu: Signal<ElementRef | undefined> = viewChild('ul');

  menuItems = input.required<MenuItem[]>();
  open = input.required<boolean>();

  openChange = output<boolean>();

  isOpen= signal(false);

  constructor() {
    effect((): void => {
      this.isOpen.set(this.open());
    });
  }

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
      this.isOpen.set(false);
    }
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    const items = this.menu()?.nativeElement.querySelectorAll('li');
    let index = Array.from(items).indexOf(document.activeElement as HTMLElement);
    if (event.key === 'ArrowDown') {
      index = (index + 1) % items.length;
      items[index].focus();
    } else if (event.key === 'ArrowUp') {
      index = (index - 1 + items.length) % items.length;
      items[index].focus();
    } else if (event.key === 'Escape') {
      this.isOpen.set(false);
    }
  }

  protected selectItem(): void {
    this.isOpen.set(false);
    this.openChange.emit(false);
  }

  protected onListItemClick(event: MouseEvent, item: MenuItem): void {
    event.stopPropagation();
    if(item?.submenu?.length != undefined) {
      if(item?.submenu?.length > 0) {
        item.isOpen = !item.isOpen;
      }
    } else {
      this.selectItem();
    }
  }
}

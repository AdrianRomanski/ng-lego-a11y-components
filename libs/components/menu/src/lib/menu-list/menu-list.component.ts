import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  input,
  output,
  viewChild,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, SelectChange } from '../menu.component';
import { closeAllSubmenus } from '../util/menu.functions';

@Component({
  selector: 'lego-components-menu-list',
  imports: [CommonModule],
  template: `
    <ul #menu role="menu" tabindex="-1">
      @for (item of items(); track item.label) {
        <li
          role="menuitem"
          tabindex="0"
          (click)="onListItemClick($event, item)"
          (keydown)="onListItemKeyDown($event, item)"
          [attr.aria-haspopup]="item.submenu ? 'true' : null"
          [attr.aria-expanded]="item.isOpen ? 'true' : null"
        >
          {{ item.label }}
          @if (item.submenu) {
            <svg
              width="15px"
              height="15px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.3153 16.6681C15.9247 17.0587 15.9247 17.6918 16.3153 18.0824C16.7058 18.4729 17.339 18.4729 17.7295 18.0824L22.3951 13.4168C23.1761 12.6357 23.1761 11.3694 22.3951 10.5883L17.7266 5.9199C17.3361 5.52938 16.703 5.52938 16.3124 5.91991C15.9219 6.31043 15.9219 6.9436 16.3124 7.33412L19.9785 11.0002L2 11.0002C1.44772 11.0002 1 11.4479 1 12.0002C1 12.5524 1.44772 13.0002 2 13.0002L19.9832 13.0002L16.3153 16.6681Z"
                fill="#0F0F0F"
              />
            </svg>
          }
          @if (item.isOpen && item.submenu) {
            <lego-components-menu-list
              #submenu
              class="submenu"
              [isTopList]="false"
              [menuItems]="item.submenu"
              (openChange)="onOpenChange($event)"
            />
          }
        </li>
      }
    </ul>
  `,
  styleUrl: './menu-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuListComponent {
  menu: Signal<ElementRef> = viewChild.required('menu');
  subMenu: Signal<MenuListComponent | undefined> = viewChild('submenu');

  menuItems = input.required<MenuItem[]>();
  isTopList = input.required<boolean>();

  openChange = output<SelectChange>();

  parentIndex = signal<number>(-1);
  items = signal<MenuItem[]>([]);
  focusedSubmenuIndex = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.items.set(this.menuItems());
    });

    effect(() => {
      const submenu = this.subMenu();
      const index = this.focusedSubmenuIndex();

      if (submenu && index !== null) {
        submenu.parentIndex.set(index);
        submenu.focusListItem(0);
        this.focusedSubmenuIndex.set(null);
      }
    });
  }

  public focusListItem(index: number): void {
    this.listItems?.[index].focus();
  }

  public selectItem(item: MenuItem): void {
    this.openChange.emit({ item });
  }

  protected onListItemKeyDown(event: KeyboardEvent, item: MenuItem): void {
    event.stopPropagation();
    const items = this.listItems;
    if (!items) return;

    let index = Array.from(items).indexOf(
      document.activeElement as HTMLLIElement
    );

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (item.submenu?.length) {
          this.openSubmenu(item, index);
        } else {
          this.selectItem(item);
        }
        break;

      case 'Escape':
        this.openChange.emit({
          focusFirst: !this.isTopList(),
          focusIndex: this.parentIndex(),
        });
        break;

      case 'ArrowDown':
        index = (index + 1) % items.length;
        items[index].focus();
        break;

      case 'ArrowUp':
        index = (index - 1 + items.length) % items.length;
        items[index].focus();
        break;

      case 'ArrowLeft':
        if(this.parentIndex() != -1) {
          this.openChange.emit({
            focusFirst: !this.isTopList(),
            focusIndex: this.parentIndex(),
          });
        }
        break;

      case 'ArrowRight':
        if (item.submenu?.length) {
          this.openSubmenu(item, index);
        }
        break;

      case 'Home':
        items[0].focus();
        break;
    }
  }

  protected onListItemClick(event: MouseEvent, item: MenuItem): void {
    event.stopPropagation();
    if (item?.submenu?.length !== undefined) {
      if (item?.submenu?.length > 0) {
        item.isOpen = !item.isOpen;
      }
    } else {
      this.selectItem(item);
    }
  }

  protected onOpenChange(openChange: SelectChange): void {
    if (openChange.focusFirst) {
      if (!this.isTopList()) {
        const index = openChange.focusIndex !== -1 ? openChange.focusIndex : 0;
        this.focusListItem(index || 0);
        this.items.set(closeAllSubmenus(this.items()));
      } else {
        this.openChange.emit(openChange);
      }
    } else if (openChange.item) {
      this.selectItem(openChange.item);
    }
  }

  private openSubmenu(item: MenuItem, index: number): void {
    item.isOpen = true;
    this.focusedSubmenuIndex.set(index);
  }

  private get listItems(): NodeListOf<HTMLLIElement> | undefined {
    return this.menu()?.nativeElement.querySelectorAll('li');
  }
}

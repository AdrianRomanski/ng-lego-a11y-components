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
  computed,
  linkedSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  focusFirstItem,
  focusLastItem,
  focusNextItem,
  focusNextItemByCharacter,
  focusPreviousItem,
} from '../util/focus.functions';
import { MenuItem, SelectChange } from '../util/menu.model';
import { getTopOffset } from '../util/styling.functions';
import { closeAllSubmenus } from '../util/submenu.functions';

@Component({
  selector: 'lego-components-menu-list',
  imports: [CommonModule],
  template: `
    <ul
      #menu
      role="menu"
      tabindex="-1"
      aria-label="Zones"
      [style.--menu-after-top]="topOffset()"
    >
      @for (item of items(); track item.label) {
      <li
        [attr.tabindex]="item.disabled ? -1 : 0"
        [attr.aria-label]="item.label"
        [attr.aria-haspopup]="item.submenu ? 'true' : null"
        [attr.aria-expanded]="item.isOpen ? 'true' : null"
        [attr.aria-disabled]="item.disabled"
        [attr.role]="item.isOpen ? 'group' : 'menuitem'"
        [class.disabled]="item.disabled"
        (keydown)="onListItemKeyDown($event, item)"
        (click)="onListItemClick($event, item)"
      >
        {{ item.label }}
        @if (item.submenu) {
        <svg
          aria-hidden="true"
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
        } @if (item.isOpen && item.submenu) {
        <lego-components-menu-list
          #submenu
          class="submenu"
          [topList]="false"
          [initialItems]="item.submenu"
          (selectChange)="onOpenChange($event)"
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

  initialItems = input.required<MenuItem[]>();
  topList = input.required<boolean>();
  disabled = input<boolean>();

  selectChange = output<SelectChange>();

  parentIndex = signal<number>(-1);
  focusedSubmenuIndex = signal<number | null>(null);

  items = linkedSignal(() => this.initialItems());

  topOffset = computed(() => getTopOffset(this.items().length));

  constructor() {
    effect(() => this.focusSubmenu(this.subMenu(), this.focusedSubmenuIndex()));
  }

  public focusListItem(index: number): void {
    this.listItems?.[index].focus();
  }

  public selectItem(item: MenuItem): void {
    this.selectChange.emit({ item });
  }

  protected onListItemKeyDown(event: KeyboardEvent, item: MenuItem): void {
    const items = this.listItems;
    if (!items) return;

    event.stopPropagation();
    const key = event.key;
    const listItems = Array.from(items);
    const index = listItems.indexOf(document.activeElement as HTMLLIElement);

    switch (key) {
      case 'Enter':
      case ' ':
        if (item.submenu?.length) {
          this.openSubmenu(item, index);
        } else {
          this.selectItem(item);
        }
        break;

      case 'Escape':
        this.closeSubmenus();
        break;

      case 'ArrowDown':
        focusNextItem(index, listItems);
        break;

      case 'ArrowUp':
        focusPreviousItem(index, listItems);
        break;

      case 'ArrowLeft':
        if (this.parentIndex() !== -1) {
          this.closeSubmenus();
        }
        break;

      case 'ArrowRight':
        if (item.submenu) {
          this.openSubmenu(item, index);
        }
        break;

      case 'Home': {
        focusFirstItem(listItems);
        break;
      }

      case 'End': {
        focusLastItem(listItems);
        break;
      }

      default:
        if (
          key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          if (this.listItems) {
            focusNextItemByCharacter(key, index, Array.from(this.listItems), this.items());
          }
        }
        break;
    }
  }

  protected onListItemClick(event: MouseEvent, item: MenuItem): void {
    event.stopPropagation();
    const currentItems = this.items();
    if (item?.submenu?.length) {
      this.closeCurrentItemsSubmenus(currentItems, item);
      item.isOpen = !item.isOpen;
      this.items.set([...currentItems]);
    } else {
      this.selectItem(item);
    }
  }

  protected onOpenChange(openChange: SelectChange): void {
    if (openChange.focusFirst) {
      if (!this.topList()) {
        const index = openChange.focusIndex !== -1 ? openChange.focusIndex : 0;
        this.focusListItem(index || 0);
        this.items.set(closeAllSubmenus(this.items()));
      } else {
        this.selectChange.emit(openChange);
      }
    } else if (openChange.item) {
      this.selectItem(openChange.item);
    }
  }

  private openSubmenu(item: MenuItem, index: number): void {
    item.isOpen = true;
    this.focusedSubmenuIndex.set(index);
  }

  private closeSubmenus(): void {
    this.selectChange.emit({
      focusFirst: !this.topList(),
      focusIndex: this.parentIndex(),
      focusTrigger: true,
    });
  }

  private closeCurrentItemsSubmenus(currentItems: MenuItem[], item: MenuItem) {
    for (const menuItem of currentItems) {
      if (menuItem.label !== item.label) {
        menuItem.isOpen = false;
      }
    }
  }

  private focusSubmenu(submenu: MenuListComponent | undefined, index: number | null): void {
    if (submenu && index != null) {
      submenu.parentIndex.set(index);
      submenu.focusListItem(0);
      this.focusedSubmenuIndex.set(null);
    }
  }

  private get listItems(): NodeListOf<HTMLLIElement> | undefined {
    return this.menu()?.nativeElement.querySelectorAll('li');
  }
}

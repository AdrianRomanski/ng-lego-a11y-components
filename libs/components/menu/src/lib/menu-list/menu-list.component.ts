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
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, SelectChange } from '../menu.component';
import {
  closeAllSubmenus,
  getNextEnabledIndex, getPreviousEnabledIndex,
  isDisabled
} from '../util/menu.functions';

@Component({
  selector: 'lego-components-menu-list',
  imports: [CommonModule],
  template: `
    <ul
      #menu
      aria-label="Zones"
      role="menu"
      tabindex="-1"
      [style.--menu-after-top]="topOffset()"
    >
      @for (item of items(); track item.label) {
      <li
        (click)="onListItemClick($event, item)"
        (keydown)="onListItemKeyDown($event, item)"
        [attr.tabindex]="item.disabled ? -1 : 0"
        [attr.aria-label]="item.label"
        [attr.aria-haspopup]="item.submenu ? 'true' : null"
        [attr.aria-expanded]="item.isOpen ? 'true' : null"
        [attr.aria-disabled]="item.disabled"
        [attr.role]="item.isOpen ? 'group' : 'menuitem'"
        [class.disabled]="item.disabled"
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
  disabled = input<boolean>();

  openChange = output<SelectChange>();

  parentIndex = signal<number>(-1);
  items = signal<MenuItem[]>([]);
  focusedSubmenuIndex = signal<number | null>(null);

  topOffset = computed(() => this.getTopOffset);

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

    const itemArray = Array.from(items);
    let index = itemArray.indexOf(document.activeElement as HTMLLIElement);
    const key = event.key;

    switch (key) {
      case 'Enter':
      case ' ':
        if (!isDisabled(itemArray[index])) {
          if (item.submenu?.length) {
            this.openSubmenu(item, index);
          } else {
            this.selectItem(item);
          }
        }
        break;

      case 'Escape':
        this.openChange.emit({
          focusFirst: !this.isTopList(),
          focusIndex: this.parentIndex(),
        });
        break;

      case 'ArrowDown':
        index = getNextEnabledIndex(index, itemArray);
        itemArray[index].focus();
        break;

      case 'ArrowUp':
        index = getPreviousEnabledIndex(index, itemArray);
        itemArray[index].focus();
        break;

      case 'ArrowLeft':
        if (this.parentIndex() !== -1) {
          this.openChange.emit({
            focusFirst: !this.isTopList(),
            focusIndex: this.parentIndex(),
          });
        }
        break;

      case 'ArrowRight':
        if (!isDisabled(itemArray[index]) && item.submenu?.length) {
          this.openSubmenu(item, index);
        }
        break;

      case 'Home': {
        let first = 0;
        while (first < itemArray.length && isDisabled(itemArray[first])) {
          first++;
        }
        if (first < itemArray.length) itemArray[first].focus();
        break;
      }

      case 'End': {
        let last = itemArray.length - 1;
        while (last >= 0 && isDisabled(itemArray[last])) {
          last--;
        }
        if (last >= 0) itemArray[last].focus();
        break;
      }

      default:
        if (
          key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          if (!this.items()[index].disabled) {
            this.focusNextItemByCharacter(key, index);
          }
        }
        break;
    }
  }

  protected onListItemClick(event: MouseEvent, item: MenuItem): void {
    event.stopPropagation();
    const currentItems = this.items();
    if (item?.submenu?.length) {
      for (const menuItem of currentItems) {
        if (menuItem.label !== item.label) {
          menuItem.isOpen = false;
        }
      }
      item.isOpen = !item.isOpen;
      this.items.set([...currentItems]);
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

  private focusNextItemByCharacter(char: string, currentIndex: number): void {
    const items = this.listItems;
    if (!items) return;

    const searchChar = char.toLowerCase();
    const total = items.length;

    const matchingIndexes: number[] = [];

    for (let i = 0; i < total; i++) {
      const label = items[i].textContent?.trim().toLowerCase() ?? '';
      if (label.startsWith(searchChar)) {
        matchingIndexes.push(i);
      }
    }

    if (matchingIndexes.length === 0) return;

    let start = matchingIndexes.findIndex((i) => i === currentIndex);
    start = start === -1 ? 0 : (start + 1) % matchingIndexes.length;

    for (let i = 0; i < matchingIndexes.length; i++) {
      const candidateIndex =
        matchingIndexes[(start + i) % matchingIndexes.length];
      if (!this.items()[candidateIndex].disabled) {
        items[candidateIndex].focus();
        break;
      }
    }
  }


  private get getTopOffset(): string {
    const count = this.items().length;

    switch (count) {
      case 0:
      case 1:
        return '80%';
      case 2:
        return '90%';
      case 3:
        return '93%';
      case 4:
        return '95%';
      case 5:
        return '96%';
      default:
        return this.calculateTopOffset(count);
    }
  }

  private calculateTopOffset(count: number): string {
    const base = 96;
    const extraItems = count - 5;
    const top = base + extraItems * 0.5;
    return `${top}%`;
  }
}

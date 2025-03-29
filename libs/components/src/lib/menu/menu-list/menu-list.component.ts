import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  input,
  output,
  viewChild, signal, effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, SelectChange } from '../menu.component';
import { closeAllSubmenus } from '../util/menu.functions';

@Component({
  selector: 'lego-components-menu-list',
  imports: [CommonModule],
  template: `
      <ul
        #menu
        role="menu"
        tabindex="-1"
      >
        @for (item of items(); track item.label) {
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

  items = signal<MenuItem[]>([]);

  constructor() {
    effect(() => {
      this.items.set(this.menuItems());
    });
  }

  public focusFirstListItem(): void {
    this.menu()?.nativeElement.querySelectorAll('li')[0].focus();
  }

  protected onListItemKeyDown(event: KeyboardEvent, item: MenuItem): void {
      event.stopPropagation();
      const items = this.menu()?.nativeElement.querySelectorAll('li');
      let index = Array.from(items).indexOf(document.activeElement as HTMLElement);
      console.log('index',index);
      if (event.key === 'Enter' || event.key === ' ') {
          if(item.submenu && item?.submenu?.length > 0) {
           item.isOpen = !item.isOpen;
          } else {
          this.selectItem(item);
          }
      } else if (event.key === 'Escape') {
          // there is a bug with menu that have more deep of nesting
          // by aria it should focus on it's father after pressing Escape
          this.openChange.emit({focusFirst: !this.isTopList()});
      } else if (event.key === 'ArrowDown') {
          items[index].classList.remove('focus-visible');
          index = (index + 1) % items.length;
          items[index].focus();
          items[index].classList.add('focus-visible');
      } else if (event.key === 'ArrowRight') {
        if(item.submenu && item?.submenu?.length > 0) {
          // const itemsMapped = this.items().map((item, index) =>
          //   index === index ? { ...item, isOpen: true } : item
          // );
          // this.items.set(itemsMapped)
          item.isOpen = true;
          items[index].classList.remove('focus-visible');
          // to later refactor, i think i need some signal in effect, that will trigger this
          setTimeout(() => {
            this.subMenu()?.menu()?.nativeElement.querySelectorAll('li')[0].focus();
            this.subMenu()?.menu()?.nativeElement.querySelectorAll('li')[0].classList.add('focus-visible');
          })
        }
      } else if (event.key === 'ArrowUp') {
        items[index].classList.remove('focus-visible');
        index = (index - 1 + items.length) % items.length;
        items[index].focus();
        items[index].classList.add('focus-visible');
      }
  }

  public selectItem(item: MenuItem): void {
    this.openChange.emit({item});
  }

  protected onListItemClick(event: MouseEvent, item: MenuItem): void {
    event.stopPropagation();
    if(item?.submenu?.length != undefined) {
      if(item?.submenu?.length > 0) {
        item.isOpen = !item.isOpen;
      }
    } else {
      this.selectItem(item);
    }
  }

  protected onOpenChange(openChange: SelectChange): void {
    if(openChange.focusFirst) {
      if(!this.isTopList()) {
        this.menu()?.nativeElement.querySelectorAll('li')[0].focus();
        this.items.set(closeAllSubmenus(this.items()))
      } else {
        this.openChange.emit(openChange);
      }
    } else if (openChange.item) {
      this.selectItem(openChange.item);
    }
  }
}

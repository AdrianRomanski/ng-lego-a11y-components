import {
  ChangeDetectionStrategy,
  Component, effect,
  input, output,
  signal,
  Signal,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './menu-list';
import { closeAllSubmenus } from './util/menu.functions';
import { ClickOutsideDirective } from './util/click-outside.directive';

export interface MenuItem {
  label: string;
  isOpen?: boolean;
  submenu?: MenuItem[];
}

export interface SelectChange {
  focusFirst?: boolean;
  item?: MenuItem;
}

/**
 *
 * A menu generally represents a grouping of common actions or functions that the user can invoke.
 * The menu role is appropriate when a list of menu items is presented in a manner similar to a menu on a desktop application.
 * Submenus, also known as pop-up menus, also have the role menu.
 *
 * While the term "menu" is a generically used term to describe site navigation,
 * the menu role is for a list of actions or functions that require complex functionality,
 * such as composite widget focus management and first-character navigation
 *
 * When a user activates a choice in a menu that has been opened, the menu usually closes.
 * If the menu choice action invokes a submenu, the menu will remain open and the submenu is displayed.
 *
 * When a menu opens, keyboard focus is placed on the first menu item.
 * To be keyboard accessible, you need to manage focus for all descendants: all menu items within the menu are focusable.
 * The menu button which opens the menu and the menu items, rather than the menu itself, are the focusable elements.
 *
 * Menu items include menuitem, menuitemcheckbox, and menuitemradio. Disabled menu items are focusable but cannot be activated.
 *
 * Menu items can be grouped in elements with the group role,
 * and separated by elements with role separator. Neither group nor separator receive focus or are interactive.
 *
 */
@Component({
  selector: 'app-components-menu',
  imports: [CommonModule, MenuListComponent, ClickOutsideDirective],
  template: `
      <button
        aria-haspopup="true"
        [attr.aria-expanded]="isOpen"
        appClickOutside
        (clickOutside)="onOutsideClick($event)"
        (click)="onMenuTriggerClick()"
        (keydown)="onMenuTriggerKeyDown($event)"
      > Menu
      </button>
      @if (isOpen()) {
        <app-menu-list
          #menuList
          [isTopList]="true"
          [menuItems]="items()"
          (openChange)="onOpenChange($event)"
        >
        </app-menu-list>
      }
  `,
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  public menuListComponent: Signal<MenuListComponent | undefined> = viewChild<MenuListComponent>('menuList');

  public menuItems = input.required<MenuItem[]>();

  public select = output<string>();

  public isOpen = signal(false);
  public items = signal<MenuItem[]>([]);

  constructor() {
    effect(() => {
      if(this.isOpen()) {
        this.menuListComponent()?.focusFirstListItem();
      }
    });
    effect(() => {
      this.items.set(this.menuItems())
    });
  }

  protected onMenuTriggerClick(): void {
    this.isOpen.set(!this.isOpen());
  }

  protected onMenuTriggerKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') {
      this.isOpen.set(!this.isOpen());
    }
  }

  protected onOutsideClick(event: Event): void {
    event.stopPropagation();
    this.isOpen.set(false);
  }

  protected onOpenChange(selectChange: SelectChange): void {
    if(selectChange.item){
      this.select.emit(selectChange.item.label);
    }
    if(selectChange.focusFirst) {
      this.menuListComponent()?.focusFirstListItem();
    } else {
      this.items.set(closeAllSubmenus(this.items()))
      this.isOpen.set(false);
    }
  }
}

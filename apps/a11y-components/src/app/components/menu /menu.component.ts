import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  Signal,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './menu-list';
import { ClickOutsideDirective } from '../click-outside.directive';

export interface MenuItem {
  label: string;
  isOpen?: boolean;
  submenu?: MenuItem[];
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
      <app-menu-list
        #menuList
        [menuItems]="menuItems()"
        [open]="isOpen()"
        (openChange)="isOpen.set($event)"
      >
      </app-menu-list>
  `,
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  private menuListComponent: Signal<MenuListComponent> = viewChild.required<MenuListComponent>('menuList');

  public menuItems = input.required<MenuItem[]>();

  public isOpen = signal(false);

  protected onMenuTriggerClick(): void {
    this.toggleMenu();
  }

  protected onMenuTriggerKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleMenu();
    }
  }

  protected onOutsideClick(event: Event): void {
    event.stopPropagation();
    this.isOpen.set(false);
  }

  private toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.menuListComponent().menu()?.nativeElement.focus();
    }
  }
}

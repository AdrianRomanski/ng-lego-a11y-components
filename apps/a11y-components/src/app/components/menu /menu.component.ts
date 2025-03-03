import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
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
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @ViewChild('menuTrigger')
  menuTrigger!: ElementRef;

  @ViewChild('menu')
  menu!: ElementRef;

  @Input()
  menuItems: MenuItem[] = [
    { label: 'Home', isOpen: false },
    { label: 'About', isOpen: false },
    { label: 'Services', isOpen: false,
      submenu: [
        { label: 'Web Design' , submenu: [ {label: 'Expensive'}, {label: 'Cheap'}]},
        { label: 'SEO' }
      ]
    },
    { label: 'Contact', isOpen: false }
  ];

  // that should be a separate directive, something like onBackDropClick or outsideClickListener
  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    if (
      this.isOpen &&
      !this.menuTrigger.nativeElement.contains(event.target) &&
      !this.menu.nativeElement.contains(event.target)
    ) {
      this.isOpen = false;
    }
  }

  public isOpen = false;

  protected onMenuTriggerClick(): void {
    this.toggleMenu();
  }

  protected onMenuTriggerKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleMenu();
    }
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
  }

  protected onListItemClick(item: MenuItem): void {
    if(item?.submenu?.length != undefined) {
      if(item?.submenu?.length > 0) {
        item.isOpen = !item.isOpen;
      }
    } else {
      this.selectItem();
    }
  }

  private toggleMenu(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.menu?.nativeElement.focus()
    }
  }
}

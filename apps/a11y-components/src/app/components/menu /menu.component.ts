import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
  @ViewChild('menuTrigger') menuTrigger!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  isOpen = false;

  // that will be an input in the future [im planning content-projection component as separate beeing]
  menuItems: MenuItem[] = [
    { label: 'Home', isOpen: false },
    { label: 'About', isOpen: false },
    { label: 'Services', isOpen: false, submenu: [
        { label: 'Web Design' },
        { label: 'SEO' }
      ] },
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

  protected onMenuTriggerKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    console.log('event', event.key);
    if (event.key === 'Enter' || event.key === ' ') {
      console.log('inside if');
      this.toggleMenu();
    }
  }

  toggleMenu(): void {
    console.log('toggleMenu');
    this.isOpen = !this.isOpen;
    console.log('this.isOpen', this.isOpen);
    if (this.isOpen) {
      console.log('inside if this.isOpen');
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
      this.menuTrigger.nativeElement.focus();
    }
  }
}

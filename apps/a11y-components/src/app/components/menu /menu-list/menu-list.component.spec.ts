import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuListComponent } from './menu-list.component';
import { Component, viewChild } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MenuListComponentHarness } from './menu-list.component.harness';
import { MenuItem } from '../menu.component';

import * as functions from './../util/menu.functions';

@Component({
  selector: 'app-test-menu-list-wrapper',
  imports: [MenuListComponent],
  template: `
    <app-menu-list
      [menuItems]="menuItems"
      [isTopList]="false"
    />
  `,
})
export class TestMenuListWrapperComponent {
  menuListComponent = viewChild.required(MenuListComponent);

  menuItems: MenuItem[] = [
    { label: 'Home', isOpen: false },
    { label: 'About', isOpen: false },
    {
      label: 'Services',
      isOpen: false,
      submenu: [
        {
          label: 'Web Design',
          submenu: [{ label: 'Expensive' }, { label: 'Cheap' }],
        },
        { label: 'SEO' },
      ],
    },
    { label: 'Contact', isOpen: false },
  ];
}

describe('MenuListComponent', () => {
  let component: TestMenuListWrapperComponent;
  let fixture: ComponentFixture<TestMenuListWrapperComponent>;
  let harness: MenuListComponentHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestMenuListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    harness =  await TestbedHarnessEnvironment
      .loader(fixture)
      .getHarness(MenuListComponentHarness);
  });

  /**
   * A menu generally represents a grouping of common actions or functions that the user can invoke.
   * The menu role is appropriate when a list of menu items is presented in a manner similar to a menu on a desktop application.
   * Submenus, also known as pop-up menus, also have the role menu.
   */
  it('should have menu role for list of menu items', async () => {
    const lists = await harness.getLists();
    const attribute = await lists.getAttribute('role');
    expect(attribute).toBe('menu');
  });

  it('should have menu role for sub menus', async () => {
    await harness.clickSubmenu();
    const lists = await harness.getLists();
    const attribute = await lists.getAttribute('role');
    expect(attribute).toBe('menu');
  });

  /**
   * When a user activates a choice in a menu that has been opened, the menu usually closes.
   * If the menu choice action invokes a submenu, the menu will remain open and the submenu is displayed.
   */
  it('should open submenu after clicking it', async () => {
    await harness.clickSubmenu();
    expect(component.menuListComponent().menuItems()[2].isOpen).toBe(true);
  });

  it('should select first item and close all submenus', async () => {
    const spy =  jest.spyOn(functions, 'closeAllSubmenus');
    await harness.clickSubmenu();
    await harness.clickOnSubListItem(0);
    await harness.pressKeyOnSubListItem('Escape', 0);
    expect(await (await harness.getItems())[0].isFocused()).toBe(true);
    expect(spy).toHaveBeenCalled();
  });


  /**
   * Keyboard interactions
   * No "clicks" allowed in this section
   */
  describe('Keyboard interactions', (): void => {
    /**
     *
     * Up Arrow
     * Moves focus to the previous item, optionally wrapping from the first to the last. Optionally, if the menuitem is in a menubar and has a submenu, opens the submenu and places focus on the last item in the submenu.
     *
     * Right Arrow
     * If in a menu opened with a menubutton and not in a menubar, if the menuitem does not have a submenu, does nothing. When focus is in a menubar, moves focus to the next item, optionally wrapping from the last to the first. When focus is in a menu and on a menuitem that has a submenu, opens the submenu and places focus on its first item. When focus is in a menu and on an item that does not have a submenu, closes the submenu and any parent menus, moves focus to the next item in the menubar, and, if focus is now on a menuitem with a submenu, either opens the submenu of that menuitem without moving focus into the submenu, or opens the submenu of that menuitem and places focus on the first item in the submenu.
     *
     * Left Arrow
     * When focus is in a menubar, moves focus to the previous item, optionally wrapping from the first to the last. When focus is in a submenu of an item in a menu, closes the submenu and returns focus to the parent menuitem. When focus is in a submenu of an item in a menubar, closes the submenu, moves focus to the previous item in the menubar, and, if focus is now on a menuitem with a submenu, either opens the submenu of that menuitem without moving focus into the submenu, or opens the submenu of that menuitem and places focus on the first item in the submenu.
     *
     * Home
     * If arrow key wrapping is not supported, moves focus to the first item in the current menu or menubar.
     *
     * End
     * If arrow key wrapping is not supported, moves focus to the last item in the current menu or menubar.
     *
     * Any key that corresponds to a printable character (Optional)
     * Move focus to the next item in the current menu whose label begins with that printable character.
     *
     * Escape
     * Close the menu that contains focus and return focus to the element or context, e.g., menu button or parent menuitem, from which the menu was opened.
     *
     * Tab
     * Moves focus to the next element in the tab sequence, and if the item that had focus is not in a menubar, closes its menu and all open parent menu containers.
     *
     * Shift + Tab
     * Moves focus to the previous element in the tab sequence, and if the item that had focus is not in a menubar, closes its menu and all open parent menu containers.
     *
     * If a menu is opened or a menu bar receives focus as a result of a context action, Escape or Enter may return focus to the invoking context.
     *
     * Some implementations of navigation menubars may have menuitem elements that both perform a function and open a submenu. In such implementations, Enter and Space perform a navigation function while Down Arrow, in a horizontal menubar, opens the submenu associated with that same menuitem.
     *
     * When items in a menubar are arranged vertically and items in menu containers are arranged horizontally the Down Arrow performs as Right Arrow is described above, the Up Arrow performs as Left Arrow is described above, and vice versa.
     */


    /**
     * Enter and Space
     * If the menuitem has a submenu, opens the submenu and places focus on its first item. Otherwise, activates the item and closes the menu.
     */
    it('should call select item when pressed enter, and its not submenu', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.pressKeyOnListItem('Tab', 0);
      await harness.pressKeyOnListItem('Tab', 1);
      await harness.pressKeyOnListItem('Enter', 2);
      await harness.pressKeyOnSubListItem('Enter', 1);
      expect(spy).toHaveBeenCalled();
    });

    it('should call select item when pressed space, and its not submenu', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.pressKeyOnListItem('Tab', 0);
      await harness.pressKeyOnListItem('Tab', 1);
      await harness.pressKeyOnListItem(' ', 2);
      await harness.pressKeyOnSubListItem(' ', 1);
      expect(spy).toHaveBeenCalled();
    });

    it('should open submenu when pressed enter, and its submenu ', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.pressKeyOnListItem('Tab', 0);
      await harness.pressKeyOnListItem('Tab', 1);
      await harness.pressKeyOnListItem('Enter', 2);
      await harness.pressKeyOnSubListItem('Enter', 0);
      expect(spy).toHaveBeenCalledTimes(0);
      expect(component.menuListComponent().items()[2].isOpen).toBe(true)
    });

    it('should open submenu when pressed space, and its submenu ', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.pressKeyOnListItem('Tab', 0);
      await harness.pressKeyOnListItem('Tab', 1);
      await harness.pressKeyOnListItem(' ', 2);
      await harness.pressKeyOnSubListItem(' ', 0);
      expect(spy).toHaveBeenCalledTimes(0);
      expect(component.menuListComponent().items()[2].isOpen).toBe(true)
    });

    /**
     * Down Arrow
     * On a menuitem that has a submenu in a menubar, opens the submenu and places focus on the first item in the submenu.
     * Otherwise, moves focus to the next item, optionally wrapping from the last to the first.
     */
    it('should focus the next item after pressing right arrow', async () => {
      await harness.focusElement(0);
      expect(await harness.isItemFocused(0)).toBe(true)
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(2)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(3)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(0)).toBe(true);
    });
  })
});


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuListComponent } from './menu-list.component';
import { Component, viewChild } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MenuListComponentHarness } from '../test';
import { MenuItem } from '../menu.component';

import * as functions from './../util/menu.functions';

@Component({
  selector: 'lego-components-test-menu-list-wrapper',
  imports: [MenuListComponent],
  template: `
    <lego-components-menu-list
      [menuItems]="menuItems"
      [isTopList]="false"
    />
  `,
})
export class TestMenuListWrapperComponent {
  menuListComponent = viewChild.required(MenuListComponent);

  menuItems: MenuItem[] = [
    { label: 'Azeroth', isOpen: false },
    { label: 'Kalimdor', isOpen: false },
    {
      label: 'Dungeons',
      isOpen: false,
      submenu: [
        {
          label: 'Classic',
          isOpen: false,
          submenu: [
            { label: 'Deadmines' },
            { label: 'Shadowfang Keep' },
          ],
        },
        { label: 'Burning Crusade' },
      ],
    },
    { label: 'Battlegrounds', isOpen: false },
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


  describe('Aria', () => {
    /**
     * A menu generally represents a grouping of common actions or functions that the user can invoke.
     * The menu role is appropriate when a list of menu items is presented in a manner similar to a menu on a desktop application.
     * Submenus, also known as pop-up menus, also have the role menu.
     */
    it('should have menu role for list of menu items', async () => {
      await harness.focusItem(0);
      const lists = await harness.getList();
      const attribute = await lists.getAttribute('role');
      expect(attribute).toBe('menu');
    });

    it('should have menu role for sub menus', async () => {
      await harness.focusItem(0);
      await harness.clickSubmenu();
      const lists = await harness.getList();
      const attribute = await lists.getAttribute('role');
      expect(attribute).toBe('menu');
    });
  })


  describe('Mouse Navigation', () => {
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
  })

  /**
   * Keyboard interactions
   * No "clicks" allowed in this section
   */
  describe('Keyboard interactions', (): void => {
    /**
     *
     * Keyboard interactions
     *
     *
     * Any key that corresponds to a printable character (Optional)
     * Move focus to the next item in the current menu whose label begins with that printable character.
     *
     * Tab
     * Moves focus to the next element in the tab sequence, and if the item that had focus is not in a menubar, closes its menu and all open parent menu containers.
     *
     * Shift + Tab
     * Moves focus to the previous element in the tab sequence, and if the item that had focus is not in a menubar, closes its menu and all open parent menu containers.
     *
     */

    /**
     * Enter and Space
     * If the menuitem has a submenu, opens the submenu and places focus on its first item. Otherwise, activates the item and closes the menu.
     */
    it('should call select item when pressed enter, and its not submenu', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(0);
      await harness.pressKeyOnListItem('Tab', 0);
      await harness.pressKeyOnListItem('Tab', 1);
      await harness.pressKeyOnListItem('Enter', 2);
      await harness.pressKeyOnSubListItem('Enter', 1);
      expect(spy).toHaveBeenCalled();
    });

    it('should call select item when pressed space, and its not submenu', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(0);
      await harness.pressKeyOnListItem('Tab', 0);
      await harness.pressKeyOnListItem('Tab', 1);
      await harness.pressKeyOnListItem(' ', 2);
      await harness.pressKeyOnSubListItem(' ', 1);
      expect(spy).toHaveBeenCalled();
    });

    it('should open submenu when pressed enter, and its submenu ', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(0);
      await harness.pressKeyOnListItem('Tab', 0);
      await harness.pressKeyOnListItem('Tab', 1);
      await harness.pressKeyOnListItem('Enter', 2);
      await harness.pressKeyOnSubListItem('Enter', 0);
      expect(spy).toHaveBeenCalledTimes(0);
      expect(component.menuListComponent().items()[2].isOpen).toBe(true)
    });

    it('should open submenu when pressed space, and its submenu ', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(0);
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
    it('should focus the next item after pressing down arrow', async () => {
      await harness.focusItem(0);
      expect(await harness.isItemFocused(0)).toBe(true)
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(2)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(3)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(0)).toBe(true);
    });

    /**
     * Right Arrow
     * If the menu item does not have a submenu:
     * Nothing happens (e.g., pressing the right arrow does nothing) because there’s no submenu to open. The focus stays on the same item.
     *
     * If the menu item has a submenu:
     * The submenu opens and focus moves to the first item in that submenu.
     */
    it('should not move focus if pressed RightArrow when focus on item without submenu', async () => {
      await harness.focusItem(0);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(1)).toBe(true);
    });

    it('should open submenu and moved focus when pressed RightArrow on item with submenu', async () => {
      await harness.focusItem(0);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(component.menuListComponent().items()[2].isOpen).toBe(false);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(component.menuListComponent().items()[2].isOpen).toBe(true);
      expect(await (await harness.getSubmenu()).isItemFocused(0)).toBe(true);
    });

    /**
     * Left Arrow
     * When focus is in a submenu of an item in a menu, closes the submenu and returns focus to the parent menuitem.
     */
    it('should return focus when pressed left arrow and in submenu', async () => {
      await harness.focusItem(0);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowRight');
      await harness.pressKeyOnFocusedItem('ArrowLeft');
      expect(await harness.isItemFocused(2)).toBe(true);
    });

    it('should close the submenu when pressed left arrow in submenu', async () => {
      await harness.focusItem(0);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(component.menuListComponent().items()[2].isOpen).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowLeft');
      expect(component.menuListComponent().items()[2].isOpen).toBe(false);
    });

    /**
     * Up Arrow
     * Moves focus to the previous item, optionally wrapping from the first to the last.
     * Optionally, if the menuitem is in a menubar and has a submenu, opens the submenu and places focus on the last item in the submenu.
     */
    it('should focus the previous item after pressing down arrow', async () => {
      await harness.focusItem(0);
      expect(await harness.isItemFocused(0)).toBe(true)
      await harness.pressKeyOnFocusedItem('ArrowUp');
      expect(await harness.isItemFocused(3)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowUp');
      expect(await harness.isItemFocused(2)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowUp');
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowUp');
      expect(await harness.isItemFocused(0)).toBe(true);
    });
  })

  /**
   * Escape
   * Close the menu that contains focus and return focus to the element or context, e.g., menu button or parent menuitem, from which the menu was opened.
   */
  it('should focus trigger after closing submenu', async () => {
    await harness.focusItem(0);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('Enter');
    const subMenuHarness = await harness.getSubmenu();
    expect(await subMenuHarness.isItemFocused(0)).toBe(true);
    await subMenuHarness.pressKeyOnFocusedItem('Escape');
    expect(await harness.isItemFocused(2)).toBe(true);
  })

  /**
   * Home
   * Moves focus to the first item in the current menu
   */
  it('should focus first item in main menu after pressing home if not in submenu', async () => {
    await harness.focusItem(0);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('ArrowDown');
    expect(await harness.isItemFocused(2)).toBe(true);
    await harness.pressKeyOnFocusedItem('Home');
    expect(await harness.isItemFocused(0)).toBe(true);
  })

  it('should focus first item in submenu after pressing home in submenu', async () => {
    await harness.focusItem(0);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('Enter');
    const subMenuHarness = await harness.getSubmenu();
    expect(await subMenuHarness.isItemFocused(0)).toBe(true);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    expect(await subMenuHarness.isItemFocused(1)).toBe(true);
    await harness.pressKeyOnFocusedItem('Home');
    expect(await subMenuHarness.isItemFocused(0)).toBe(true);
  })

  /**
   * End
   * If arrow key wrapping is not supported, moves focus to the last item in the current menu or menubar.
   */
  it('should focus last item in menu after pressing end in menu', async () => {
    await harness.focusItem(0);
    expect(await harness.isItemFocused(0)).toBe(true);
    await harness.pressKeyOnFocusedItem('End');
    expect(await harness.isItemFocused(3)).toBe(true);
  })


  it('should focus last item in submenu after pressing end in submenu', async () => {
    await harness.focusItem(0);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('Enter');
    const subMenuHarness = await harness.getSubmenu();
    expect(await subMenuHarness.isItemFocused(0)).toBe(true);
    await harness.pressKeyOnFocusedItem('End');
    expect(await subMenuHarness.isItemFocused(1)).toBe(true);
  })
});




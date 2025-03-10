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
    const attribute = await lists[0].getAttribute('role');
    expect(attribute).toBe('menu');
  });

  it('should have menu role for sub menus', async () => {
    await harness.clickSubmenu();
    const lists = await harness.getLists();
    const attribute = await lists[0].getAttribute('role');
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
   * Space / Enter
   * If the item is a parent menu item, it opens the submenu and moves focus to the first item in the submenu.
   * Otherwise, activates the menu item, which loads new content and places focus on the heading that titles the content.
   */


  // to be refactored later, i can't be clicking in keyboard navigation tests... cmon
  it('should call select item when pressed enter, and its not submenu', async () => {
    const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
    await harness.clickSubmenu();
    await harness.pressKeyOnSubListItem('Enter', 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should open submenu when pressed enter, and its submenu ', async () => {
    const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
    await harness.clickSubmenu();
    await harness.pressKeyOnSubListItem('Enter', 0);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(component.menuListComponent().items()[2].isOpen).toBe(true)
  });



  /***
   *
   *
   *
   * Right Arrow
   * In a menubar, moves focus to the next item in the menubar. If focus is on the last item, it moves focus to the first item.
   * If in a submenu, if focus is on an item that does not have a submenu, it closes the submenu and moves focus to the next item in the menubar.
   * Otherwise, it opens the submenu of the newly focused menubar item, keeping focus on that parent menubar item.
   * If not in a menubar or submenu and not on a menuitem with a submenu, if focus is not the last focusable element in the menu, it optionally moves focus to the next focusable element.
   *
   * Left Arrow
   * Moves focus to the previous item in the menubar.
   * If focus is on the first item, it moves focus to the last item.
   * If in a submenu, it closes the submenu and moves focus to the parent menu item.
   * If not in a menubar or submenu, if focus is not the first focusable element in the menu, it optionally moves focus to the last focusable element.
   *
   * Down Arrow
   * Opens submenu and moves focus to the first item in the submenu.
   *
   * Up Arrow
   * Opens submenu and moves focus to the last item in the submenu.
   *
   * Home
   * Moves focus to the first item in the menubar.
   *
   * End
   * Moves focus to the last item in the menubar.
   *
   * Any character key
   * Moves focus to the next item in the menubar having a name that starts with the typed character. If none of the items have a name starting with the typed character, focus does not move.
   */
});


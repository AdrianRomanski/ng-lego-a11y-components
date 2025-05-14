import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

import { MenuComponentHarness } from './test';
import { MenuComponent, MenuItem } from './menu.component';
import { isAllClosed } from './util/menu.functions';

@Component({
  selector: 'lego-components-test-menu-wrapper',
  imports: [MenuComponent],
  template: `
    <lego-components-components-menu
      [menuItems]="menuItems"
      (selectItem)="onSelect()"
    ></lego-components-components-menu> `,
})
export class TestMenuWrapperComponent {
  menuComponent = viewChild.required(MenuComponent);

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelect() {}
}

describe('TestMenuWrapperComponent', () => {
  let fixture: ComponentFixture<TestMenuWrapperComponent>;
  let harness: MenuComponentHarness;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TestMenuWrapperComponent);
    harness =  await TestbedHarnessEnvironment.loader(fixture).getHarness(MenuComponentHarness);
    fixture.detectChanges();
  });

  describe('Mouse Interactions', (): void => {
    /**
     * When a user activates a choice in a menu that has been opened, the menu usually closes.
     * If the menu choice action invokes a submenu, the menu will remain open and the submenu is displayed.
     */
    it('should open the menu after clicking the button', async () => {
      await harness.clickButton();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    });

    it('should close the menu after clicking the button', async () => {
      await harness.clickButton();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
      await harness.clickButton();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
    });

    it('should close the menu when clicked outside of it', async () => {
      await harness.clickButton();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
      await harness.clickOutside();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
    });

    it('should close the menu after clicking item', async () => {
      await harness.clickButton();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
      await harness.clickItem(1);
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
    });

    it('should not close the menu if clicked on submenu', async () => {
      await harness.clickButton();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
      await harness.clickSubmenu();
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    });

    /**
     * When a menu opens, keyboard focus is placed on the first menu item.
     */
    it('should focus first item in list after opening menu', async () => {
      await harness.clickButton();
      expect(await harness.isItemFocused(0)).toBe(true);
    });

    it('should emit select when clicked on item in menu', async () => {
      const spy = jest.spyOn(fixture.componentInstance, 'onSelect');
      await harness.clickButton();
      await harness.clickItem(1);
      expect(spy).toHaveBeenCalled();
    })

    it('should emit select when clicked on item in sub menu', async () => {
      const spy = jest.spyOn(fixture.componentInstance, 'onSelect');
      await harness.clickButton();
      await harness.clickItem(2);
      await harness.clickOnSubListItem(1);
      expect(spy).toHaveBeenCalled();
    })

    it('should not emit select when clicked on sub menu', async () => {
      const spy = jest.spyOn(fixture.componentInstance, 'onSelect');
      await harness.clickButton();
      await harness.clickSubmenu();
      expect(spy).toHaveBeenCalledTimes(0);
    })

    it('should close all the submenus and menu after selecting item', async () => {
      await harness.clickButton();
      await harness.clickSubmenu();
      expect(isAllClosed(fixture.componentInstance.menuComponent().items())).toBe(false);
      await harness.clickOnSubListItem(1);
      expect(isAllClosed(fixture.componentInstance.menuComponent().items())).toBe(true);
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
    })
  })

  describe('Keyboard Interactions', (): void => {
    /**
     * To be keyboard accessible, you need to manage focus for all descendants: all menu items within the menu are focusable.
     * The menu button which opens the menu and the menu items, rather than the menu itself, are the focusable elements.
     */

    /** Enter and space
     *  Open menu
     */
    it('should open the menu if pressed enter on menu button', async () => {
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
      await harness.pressKeyOnMenuButton('Enter');
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    });

    it('should open the menu if pressed space on menu button', async () => {
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
      await harness.pressKeyOnMenuButton(' ');
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    });

    /** Escape
     *  When in main menu, it closes it
     *  When in submenu it closes it, but main menu remains opened
     */
    it('should close the menu when pressed escape when not in a submenu', async () => {
      await harness.pressKeyOnMenuButton('Enter');
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
      await harness.pressKeyOnListItem('Escape', 0);
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
    });

    it('should close all the submenus after clicking escape on main menu', async () => {
      await harness.pressKeyOnMenuButton('Enter');
      await harness.pressKeyOnListItem('Enter', 2);
      expect(isAllClosed(fixture.componentInstance.menuComponent().items())).toBe(false);
      await harness.pressKeyOnListItem('Escape', 2);
      expect(isAllClosed(fixture.componentInstance.menuComponent().items())).toBe(true);
    })

    it('should close all the nested submenus after clicking escape on submenu', async () => {
      await harness.pressKeyOnMenuButton('Enter');
      await harness.pressKeyOnListItem('Enter', 2);
      expect(isAllClosed(fixture.componentInstance.menuComponent().items())).toBe(false);
      await harness.pressKeyInSubmenu('Escape', 0);
      expect(isAllClosed(fixture.componentInstance.menuComponent().items()[2].submenu || [])).toBe(true);
    })

    it('should not close the menu when pressed escape in a submenu', async () => {
      await harness.pressKeyOnMenuButton('Enter');
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
      await harness.pressKeyOnListItem('Enter', 2);
      await harness.pressKeyInSubmenu('Escape', 0);
      expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    })
  })
});




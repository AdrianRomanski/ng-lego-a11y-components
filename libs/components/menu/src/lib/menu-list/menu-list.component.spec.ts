import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuListComponent } from './menu-list.component';
import { Component, viewChild } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MenuListComponentHarness } from '../test';
import { MenuItem } from '../menu.component';

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
    { label: 'Azeroth-1', isOpen: false, disabled: true },
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
    { label: 'Battlegrounds Epic', isOpen: false },
    { label: 'Battlegrounds', isOpen: false, disabled: true },
    { label: 'Battlegrounds Classic', isOpen: false },
    { label: 'Battlegrounds Old', isOpen: false, disabled: true },
  ];
}

describe('MenuListComponent', () => {
  const FIRST_FOCUSABLE = 1;
  const LAST_FOCUSABLE = 6;
  const SUB_MENU = 3;
  const DISABLED_ITEM = 5;

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


  describe('Associated WAI-ARIA roles, states, and properties', () => {
    /**
     *
     * ## Menu List
     * - **aria-haspopup**
     *   Indicates the availability and type of interactive popup that can be triggered by the menuitem
     *
     */

    /**
     * Menu
     */
    it('should set role="menu" on the list container element', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      const lists = await harness.getList();
      const attribute = await lists.getAttribute('role');
      expect(attribute).toBe('menu');
    });

    it('should set role="menuitem" on items when submenu is closed', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      const items = await harness.getItems();
      const attribute = await items[2].getAttribute('role');
      expect(attribute).toBe('menuitem');
    });

    /**
     * Group
     */
    it('should set role="group" on item when its submenu is open', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      const items = await harness.getItems();
      await harness.focusItem(SUB_MENU);
      await harness.pressKeyOnFocusedItem('Enter');
      fixture.detectChanges();
      const attribute = await items[SUB_MENU].getAttribute('role');
      expect(attribute).toBe('group');
    });

    /**
     * Disabled
     */
    it('should set aria-disabled="true" on disabled menu items', async () => {
      const items = await harness.getItems();
      const attribute = await items[DISABLED_ITEM].getAttribute('aria-disabled');
      expect(attribute).toBe('true');
    });

    it('should not set aria-disabled on enabled menu items', async () => {
      const items = await harness.getItems();
      const attribute = await items[FIRST_FOCUSABLE].getAttribute('aria-disabled');
      expect(attribute).toBeNull();
    });

    /**
     * Haspopup
     */
    it('should set aria-haspopup="true" on list item with sub menu', async () => {
      const items = await harness.getItems();
      const attribute = await items[SUB_MENU].getAttribute('aria-haspopup');
      expect(attribute).toBe('true');
    });

    it('should set aria-haspopup="null" on list item without sub menu', async () => {
      const items = await harness.getItems();
      const attribute = await items[2].getAttribute('aria-haspopup');
      expect(attribute).toBe(null);
    });

  })

  describe('Mouse Navigation', () => {
    it('should set submenu to open state after clicking on it', async () => {
      await harness.clickSubmenu();
      expect(component.menuListComponent().menuItems()[SUB_MENU].isOpen).toBe(true);
    });
  })

  describe('Keyboard interactions', (): void => {
     /**
     * ENTER and SPACE
     */
    it('should select item on Enter when focused item is not a submenu', async () => {
      const spy = jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('Enter');
      expect(spy).toHaveBeenCalled();
    });

    it('should select item on Space when focused item is not a submenu', async () => {
      const spy = jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(0);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem(' ');
      expect(spy).toHaveBeenCalled();
    });

    it('should open submenu on Enter when focused item has submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('Enter');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(true);
    });

    it('should open submenu on Space when focused item has submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem(' ');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(true);
    });

    /**
     * Down Arrow
     */
    it('should navigate to next focusable item using Down Arrow', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(2)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(3)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(4)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(DISABLED_ITEM)).toBe(false);
      expect(await harness.isItemFocused(LAST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
    });

    /**
     * Right Arrow
     */
    it('should not open submenu on Right Arrow if item has no submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(1)).toBe(true);
    });

    it('should open submenu and move focus on Right Arrow when item has submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(false);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(true);
      expect(await (await harness.getSubmenu()).isItemFocused(0)).toBe(true);
    });

    /**
     * Left Arrow
     */
    it('should return focus to parent menu on Left Arrow when in submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(SUB_MENU)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(SUB_MENU)).toBe(false);
      await harness.pressKeyOnFocusedItem('ArrowLeft');
      expect(await harness.isItemFocused(SUB_MENU)).toBe(true);
    });

    it('should close submenu on Left Arrow when in submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowLeft');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(false);
    });

    /**
     * Up Arrow
     */
    it('should navigate to previous focusable item using Up Arrow', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowUp');
      expect(await harness.isItemFocused(LAST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowUp');
      expect(await harness.isItemFocused(DISABLED_ITEM)).toBe(false);
      expect(await harness.isItemFocused(4)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowUp');
      expect(await harness.isItemFocused(3)).toBe(true);
    });

    /**
     * Escape
     */
    it('should return focus to trigger item on Escape from submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('Enter');
      const subMenuHarness = await harness.getSubmenu();
      expect(await subMenuHarness.isItemFocused(0)).toBe(true);
      await subMenuHarness.pressKeyOnFocusedItem('Escape');
      expect(await harness.isItemFocused(SUB_MENU)).toBe(true);
    });

    /**
     * Home
     */
    it('should focus first item in main menu on Home key', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(3)).toBe(true);
      await harness.pressKeyOnFocusedItem('Home');
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
    });

    it('should focus first item in submenu on Home key', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('Enter');
      const subMenuHarness = await harness.getSubmenu();
      expect(await subMenuHarness.isItemFocused(0)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await subMenuHarness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('Home');
      expect(await subMenuHarness.isItemFocused(0)).toBe(true);
    });

    it('should skip disabled item on Home key', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(2)).toBe(true);
      await harness.pressKeyOnFocusedItem('Home');
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
    });

    /**
     * End
     */
    it('should focus last item in menu on End key', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('End');
      expect(await harness.isItemFocused(LAST_FOCUSABLE)).toBe(true);
    });

    it('should focus last item in submenu on End key', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('Enter');
      const subMenuHarness = await harness.getSubmenu();
      expect(await subMenuHarness.isItemFocused(0)).toBe(true);
      await harness.pressKeyOnFocusedItem('End');
      expect(await subMenuHarness.isItemFocused(1)).toBe(true);
    });

    it('should skip disabled item on End key', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('End');
      expect(await harness.isItemFocused(LAST_FOCUSABLE)).toBe(true);
    });

    /**
     * Printable Character Keys
     */
    it('should focus next item starting with typed character', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('B');
      expect(await harness.isItemFocused(4)).toBe(true);
    });

    it('should not focus disabled item even if it matches typed character', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('B');
      expect(await harness.isItemFocused(DISABLED_ITEM)).toBe(false);
    });

    it('should wrap around when matching character has no more matches forward', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('B');
      await harness.pressKeyOnFocusedItem('B');
      expect(await harness.isItemFocused(6)).toBe(true);
      await harness.pressKeyOnFocusedItem('B');
      expect(await harness.isItemFocused(4)).toBe(true);
    });

    it('should skip disabled item when focusing by character', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('b');
      expect(await harness.isItemFocused(4)).toBe(true);
    });
  });
})




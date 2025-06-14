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
     *
     * - **menu role**
     *   A widget providing a list of choices. Required context role (or menubar)
     *
     * - **menubar role**
     *   A presentation of a menu that usually remains visible and is usually
     *   presented horizontally. Required context role (or menu)
     *
     * - **group role**
     *   Can be used to identify a set of related menuitems within or otherwise owned by a menu or menubar
     *
     * - **aria-disabled**
     *   Indicates the element is perceivable but disabled, so it is not operable
     *
     * - **aria-haspopup**
     *   Indicates the availability and type of interactive popup that can be triggered by the menuitem
     *
     */
    it('should have role menu for list of menu items', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      const lists = await harness.getList();
      const attribute = await lists.getAttribute('role');
      expect(attribute).toBe('menu');
    });

    it('should have role list item if submenu is closed', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      const items = await harness.getItems();
      const attribute = await items[2].getAttribute('role');
      expect(attribute).toBe('menuitem');
    });

    it('should have role list item if its submenu is open', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      const items = await harness.getItems();
      await harness.focusItem(SUB_MENU);
      await harness.pressKeyOnFocusedItem('Enter');
      fixture.detectChanges();
      const attribute = await items[SUB_MENU].getAttribute('role');
      expect(attribute).toBe('group');
    });

    it('should set aria-disabled on disabled items', async () => {
      const items = await harness.getItems();
      const attribute = await items[DISABLED_ITEM].getAttribute('aria-disabled');
      expect(attribute).toBe('true');
    });

    it('should not set aria-disabled on enabled items', async () => {
      const items = await harness.getItems();
      const attribute = await items[FIRST_FOCUSABLE].getAttribute('aria-disabled');
      expect(attribute).toBeNull();
    });
  })

  describe('Mouse Navigation', () => {
    /**
     * When a user activates a choice in a menu that has been opened, the menu usually closes.
     * If the menu choice action invokes a submenu, the menu will remain open and the submenu is displayed.
     */
    it('should open submenu after clicking it', async () => {
      await harness.clickSubmenu();
      expect(component.menuListComponent().menuItems()[SUB_MENU].isOpen).toBe(true);
    });
  })

  describe('Keyboard interactions', (): void => {
    /**
     *
     * ### Keyboard interactions
     *
     *   **Enter and Space**
     *   If the menuitem has a submenu, opens the submenu and places focus on its first item.
     *   Otherwise, activates the item and closes the menu.
     *
     *   **Down Arrow**
     *   On a menuitem that has a submenu in a menubar, opens the submenu and places focus on the first item in the submenu.
     *   Otherwise, moves focus to the next item, optionally wrapping from the last to the first.
     *
     *   **Up Arrow**
     *   - Moves focus to the previous item, optionally wrapping from the first to the last.
     *   - Optionally, if the menuitem is in a menubar and has a submenu, opens the submenu
     *     and places focus on the last item in the submenu.
     *
     *   **Right Arrow**
     *   - If in a menu opened with a menubutton and not in a menubar, if the menuitem does not have a submenu, does nothing.
     *   - When focus is in a menubar, moves focus to the next item, optionally wrapping from the last to the first.
     *   - When focus is in a menu and on a menuitem that has a submenu, opens the submenu and places focus on its first item.
     *   - When focus is in a menu and on an item that does not have a submenu, closes the submenu and any parent menus,
     *   - moves focus to the next item in the menubar, and, if focus is now on a menuitem with a submenu, either opens
     *   - the submenu of that menuitem without moving focus into the submenu, or opens the submenu of
     *   - that menuitem and places focus on the first item in the submenu.
     *
     *   **Left Arrow**
     *   - When focus is in a menubar, moves focus to the previous item, optionally wrapping from the first to the last.
     *   - When focus is in a submenu of an item in a menu, closes the submenu and returns focus to the parent menuitem.
     *   - When focus is in a submenu of an item in a menubar, closes the submenu, moves focus to the previous item in the menubar,
     *   - and, if focus is now on a menuitem with a submenu, either opens the submenu of that menuitem without moving
     *   - focus into the submenu, or opens the submenu of that menuitem and places focus on the first item in the submenu.
     *
     *   **Home**
     *   - If arrow key wrapping is not supported, moves focus to the first item in the current menu or menubar.
     *
     *   **End**
     *   - If arrow key wrapping is not supported, moves focus to the last item in the current menu or menubar.
     *
     *   **Any key that corresponds to a printable character (Optional)**
     *   - Move focus to the next item in the current menu whose label begins with that printable character.
     *
     *   **Escape**
     *   - Close the menu that contains focus and return focus to the element or context,
     *   - e.g., menu button or parent menuitem, from which the menu was opened.
     *
     *   **Tab**
     *   - Moves focus to the next element in the tab sequence, and if the item that had focus is not in a menubar,
     *   - closes its menu and all open parent menu containers.
     *
     *   **Shift + Tab**
     *   - Moves focus to the previous element in the tab sequence, and if the item that had focus is not in a menubar,
     *   - closes its menu and all open parent menu containers.
     *
     *
     * - If a menu is opened or a menu bar receives focus as a result of a context action,
     * Escape or Enter may return focus to the invoking context.
     *
     * - Some implementations of navigation menubars may have menuitem elements that both perform a function and open a submenu.
     * In such implementations, Enter and Space perform a navigation function while Down Arrow, in a horizontal menubar,
     * opens the submenu associated with that same menuitem.
     *
     * - When items in a menubar are arranged vertically and items in menu containers are arranged horizontally
     * the Down Arrow performs as Right Arrow is described above, the Up Arrow performs as Left Arrow is described above, and vice versa.

    /**
     * ENTER and SPACE
     */
    it('should call select item when pressed enter, and its not submenu', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('Enter');
      expect(spy).toHaveBeenCalled();
    });

    it('should call select item when pressed space, and its not submenu', async () => {
      const spy =  jest.spyOn(component.menuListComponent(), 'selectItem');
      await harness.focusItem(0);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem(' ');
      expect(spy).toHaveBeenCalled();
    });

    it('should open submenu when pressed enter, and its present', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('Enter');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(true)
    });

    it('should open submenu when pressed space, and its submenu ', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem(' ');
      expect(component.menuListComponent().items()[SUB_MENU].isOpen).toBe(true)
    });

    /**
     * Down Arrow
     */
    it('should focus the next item after pressing down arrow', async () => {
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
    it('should not move focus if pressed RightArrow when focus on item without submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(1)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(1)).toBe(true);
    });

    it('should open submenu and moved focus when pressed RightArrow on item with submenu', async () => {
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
    it('should return focus when pressed left arrow and in submenu', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      await harness.pressKeyOnFocusedItem('ArrowDown');
      await harness.pressKeyOnFocusedItem('ArrowDown');
      expect(await harness.isItemFocused(SUB_MENU)).toBe(true);
      await harness.pressKeyOnFocusedItem('ArrowRight');
      expect(await harness.isItemFocused(SUB_MENU)).toBe(false);
      await harness.pressKeyOnFocusedItem('ArrowLeft');
      expect(await harness.isItemFocused(SUB_MENU)).toBe(true);
    });

    it('should close the submenu when pressed left arrow in submenu', async () => {
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
    it('should focus the previous item after pressing up arrow', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true)
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
  it('should focus trigger after closing submenu', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('Enter');
    const subMenuHarness = await harness.getSubmenu();
    expect(await subMenuHarness.isItemFocused(0)).toBe(true);
    await subMenuHarness.pressKeyOnFocusedItem('Escape');
    expect(await harness.isItemFocused(SUB_MENU)).toBe(true);
  })

  /**
   * Home
   */
  it('should focus first item in main menu after pressing home if not in submenu', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('ArrowDown');
    expect(await harness.isItemFocused(3)).toBe(true);
    await harness.pressKeyOnFocusedItem('Home');
    expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
  })

  it('should focus first item in submenu after pressing home in submenu', async () => {
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
  })

  it('should skip disabled item when pressing HOME', async () => {
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
  it('should focus last item in menu after pressing end in menu', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
    await harness.pressKeyOnFocusedItem('End');
    expect(await harness.isItemFocused(LAST_FOCUSABLE)).toBe(true);
  })

  it('should focus last item in submenu after pressing end in submenu', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('ArrowDown');
    await harness.pressKeyOnFocusedItem('Enter');
    const subMenuHarness = await harness.getSubmenu();
    expect(await subMenuHarness.isItemFocused(0)).toBe(true);
    await harness.pressKeyOnFocusedItem('End');
    expect(await subMenuHarness.isItemFocused(1)).toBe(true);
  })

  it('should skip disabled item when pressing end', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    expect(await harness.isItemFocused(1)).toBe(true);
    await harness.pressKeyOnFocusedItem('End');
    expect(await harness.isItemFocused(LAST_FOCUSABLE)).toBe(true);
  });

  /**
   * Any key that corresponds to a printable character (Optional)
   */
  it('should move focus to next item that is starting with entered character', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
    await harness.pressKeyOnFocusedItem('B');
    expect(await harness.isItemFocused(4)).toBe(true);
  })

  it('should not move focus to next item that is starting with entered character if it is disabled', async () => {
      await harness.focusItem(FIRST_FOCUSABLE);
      expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
      await harness.pressKeyOnFocusedItem('B');
      expect(await harness.isItemFocused(DISABLED_ITEM)).toBe(false);
  });

  it('should move focus to first item with starting character if there are no more items left', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    expect(await harness.isItemFocused(FIRST_FOCUSABLE)).toBe(true);
    await harness.pressKeyOnFocusedItem('B');
    await harness.pressKeyOnFocusedItem('B');
    expect(await harness.isItemFocused(6)).toBe(true);
    await harness.pressKeyOnFocusedItem('B');
    expect(await harness.isItemFocused(4)).toBe(true);
  })

  it('should skip disabled item when matching first character, and focus next', async () => {
    await harness.focusItem(FIRST_FOCUSABLE);
    await harness.pressKeyOnFocusedItem('b');
    expect(await harness.isItemFocused(4)).toBe(true);
  });
});
})




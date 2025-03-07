import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponentHarness } from './menu.component.harness';
import { Component, viewChild } from '@angular/core';
import { MenuComponent, MenuItem } from './menu.component';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

@Component({
  selector: 'app-test-menu-wrapper',
  imports: [MenuComponent],
  template: `
    <app-components-menu
      [menuItems]="menuItems"
    ></app-components-menu> `,
})
export class TestMenuWrapperComponent {
  menuComponent = viewChild.required(MenuComponent);

  menuItems: MenuItem[] = [
    { label: 'Home', isOpen: false },
    { label: 'About', isOpen: false },
    {
      label: 'Services',
      isOpen: false,
      submenu: [
        {
          label: 'Web Design', submenu: [
            {
              label: 'Black White',
            },
            { label: 'Color' },
          ],
        },
        { label: 'SEO' },
      ],
    },
    { label: 'Contact', isOpen: false },
  ]
}

describe('TestMenuWrapperComponent', () => {
  let fixture: ComponentFixture<TestMenuWrapperComponent>;
  let harness: MenuComponentHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TestMenuWrapperComponent);
    harness =  await TestbedHarnessEnvironment.loader(fixture).getHarness(MenuComponentHarness);
    fixture.detectChanges();
  });

  it('should open the menu after clicking the button', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
  });

  it('should close the menu after clicking the button', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
  });

  it('should close the menu when clicked outside of it', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    await harness.clickOutside();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
  });

  /**
   * When a user activates a choice in a menu that has been opened, the menu usually closes.
   * If the menu choice action invokes a submenu, the menu will remain open and the submenu is displayed.
   */
  it('should close the menu after clicking item', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    await harness.clickItem(1);
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
  });

  it('should not close the menu if clicked on submenu', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    await harness.clickSubmenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
  });

  /**
   * When a menu opens, keyboard focus is placed on the first menu item.
   */
  it('should focus first item in list after opening menu', async () => {
    await harness.toggleMenu();
    expect(await harness.isItemFocused(0)).toBe(true);
  });

  /**
   * To be keyboard accessible, you need to manage focus for all descendants: all menu items within the menu are focusable.
   * The menu button which opens the menu and the menu items, rather than the menu itself, are the focusable elements.
   */

  /** Escape
   * When in a submenu, it closes the submenu and moves focus to the parent menu or menubar item.
   * When in main menu, it closes it
   */
  it('should close the menu when pressed escape when not in a submenu', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    await harness.pressKey('Escape');
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(false);
  })

  it('should not close the menu when pressed escape in a submenu', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    await harness.pressKeyInSubmenu('Escape');
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
  })

  it('should close the sub menu and all it submenus when pressed escape in a submenu', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen()).toBe(true);
    await harness.pressKeyInSubmenu('Escape');
    expect(isAllClosed(fixture.componentInstance.menuItems)).toBe(true);
  })
  /**
   * Missing tests for focus first item!
   */
});

export function isAllClosed(menuItems: MenuItem[]): boolean {
  for (const item of menuItems) {
    if (item.isOpen === true) {
      return false;
    }
    if (item.submenu && !isAllClosed(item.submenu)) {
      return false;
    }
  }
  return true;
}


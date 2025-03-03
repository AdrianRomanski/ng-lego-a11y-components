import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponentHarness } from './menu.component.harness';
import { Component, viewChild } from '@angular/core';
import { MenuComponent } from './menu.component';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

describe('TestMenuWrapperComponent', () => {
  let fixture: ComponentFixture<TestMenuWrapperComponent>;
  let harness: MenuComponentHarness;
  let loader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TestMenuWrapperComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    harness =  await loader.getHarness(MenuComponentHarness);
    fixture.detectChanges();
  });

  /**
   * A menu generally represents a grouping of common actions or functions that the user can invoke.
   * The menu role is appropriate when a list of menu items is presented in a manner similar to a menu on a desktop application.
   * Submenus, also known as pop-up menus, also have the role menu.
   */
  it('should have menu role for list of menu items', async () => {
    await harness.toggleMenu();
    const lists = await harness.getLists();
    const attribute = await lists[0].getAttribute('role');
    expect(attribute).toBe('menu');
  });

  it('should have menu role for sub menus', async () => {
    await harness.toggleMenu();
    await harness.clickSubmenu();
    const lists = await harness.getLists();
    const attribute = await lists[0].getAttribute('role');
    expect(attribute).toBe('menu');
  });

  /**
   * When a user activates a choice in a menu that has been opened, the menu usually closes.
   * If the menu choice action invokes a submenu, the menu will remain open and the submenu is displayed.
   */
  it('should close the menu after choosing item', async () => {
    await harness.toggleMenu();
    await harness.clickItem(1);
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(false);
  });

  it('should not close the menu after clicking submenu', async () => {
    await harness.toggleMenu();
    await harness.clickSubmenu();
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(true);
  });

  it('should open submenu after clicking it', async () => {
    await harness.toggleMenu();
    await harness.clickSubmenu();
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(true);
    expect(fixture.componentInstance.menuComponent().menuItems[2].isOpen).toBe(true);
  });

});
@Component({
  selector: 'app-test-menu-wrapper',
  imports: [MenuComponent],
  template: ` <app-components-menu></app-components-menu> `,
})
export class TestMenuWrapperComponent {
  menuComponent = viewChild.required(MenuComponent);
}

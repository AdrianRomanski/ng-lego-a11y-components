import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuListComponent } from './menu-list.component';
import { Component, viewChild } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MenuListComponentHarness } from './menu-list.component.harness';
import { MenuItem } from '../menu.component';

@Component({
  selector: 'app-test-menu-list-wrapper',
  imports: [MenuListComponent],
  template: `
    <app-menu-list
      [menuItems]="menuItems"
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
});


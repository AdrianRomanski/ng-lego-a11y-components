import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponentHarness } from './menu.component.harness';
import { Component } from '@angular/core';
import { MenuComponent } from './menu.component';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

describe('TestMenuWrapperComponent', () => {
  let fixture: ComponentFixture<TestMenuWrapperComponent>;
  let harness: MenuComponentHarness;
  let loader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [MatButtonModule],
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
    await harness.openSubmenu(2);
    const lists = await harness.getLists();
    const attribute = await lists[0].getAttribute('role');
    expect(attribute).toBe('menu');
  });

});
@Component({
  selector: 'app-test-menu-wrapper',
  imports: [MenuComponent],
  template: ` <app-components-menu></app-components-menu> `,
})
export class TestMenuWrapperComponent {}

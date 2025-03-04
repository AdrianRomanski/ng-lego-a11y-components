import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponentHarness } from './menu.component.harness';
import { Component, viewChild } from '@angular/core';
import { MenuComponent } from './menu.component';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

@Component({
  selector: 'app-test-menu-wrapper',
  imports: [MenuComponent],
  template: ` <app-components-menu></app-components-menu> `,
})
export class TestMenuWrapperComponent {
  menuComponent = viewChild.required(MenuComponent);
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
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(true);
  });

  it('should close the menu after clicking the button', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(true);
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(false);
  });

  /**
   * When a user activates a choice in a menu that has been opened, the menu usually closes.
   * If the menu choice action invokes a submenu, the menu will remain open and the submenu is displayed.
   */
  it('should close the menu after clicking item', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(true);
    await harness.clickItem(1);
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(false);
  });

  it('should not close the menu if clicked on submenu', async () => {
    await harness.toggleMenu();
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(true);
    await harness.clickSubmenu();
    expect(fixture.componentInstance.menuComponent().isOpen).toBe(true);
  });
});


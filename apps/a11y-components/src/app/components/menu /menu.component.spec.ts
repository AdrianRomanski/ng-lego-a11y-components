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

  it('should toggle menu open and close', async () => {
    expect(await harness.getMenuItemCount()).toBe(0);

    await harness.toggleMenu();
    expect(await harness.getMenuItemCount()).toBeGreaterThan(0);

    await harness.toggleMenu();
    expect(await harness.getMenuItemCount()).toBe(0);
  });
});
@Component({
  selector: 'app-test-menu-wrapper',
  imports: [MenuComponent],
  template: ` <app-components-menu></app-components-menu> `,
})
export class TestMenuWrapperComponent {}

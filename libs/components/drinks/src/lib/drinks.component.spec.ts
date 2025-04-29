import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinksComponent } from './drinks.component';
import { DrinksComponentHarness } from './testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, viewChild } from '@angular/core';

@Component({
  selector: 'lego-components-drinks-test-wrapper',
  standalone: true,
  imports: [DrinksComponent],
  template: `
    <lego-components-drinks></lego-components-drinks>
  `
})
export class TestDrinksComponent {
    component = viewChild.required(DrinksComponent);
}

describe('DrinksComponent', () => {
  let testWrapper: TestDrinksComponent;
  let fixture: ComponentFixture<TestDrinksComponent>;
  let harness: DrinksComponentHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDrinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDrinksComponent);
    testWrapper = fixture.componentInstance;
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment
      .loader(fixture)
      .getHarness(DrinksComponentHarness);
  });

  /**
   * A closed menu widget is usually opened, or made visible, by activating a menu button
   */
  it('should open the menu when pressed button', async () => {
    expect(testWrapper.component().open()).toBe(false);
    await harness.pressKeyOnTrigger('Enter');
    expect(testWrapper.component().open()).toBe(true);
  })

  /**
   * tabindex attribute
   * The menu container has tabindex set to -1
   */
  it('menu should have tabindex set to 0', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect(await harness.hasMenuAttribute('tabIndex')).toBe('-1');
  })

  /**
   * tabindex attribute
   * each item in the menu has tabindex set to -1.
   */
  it('menu item should have tabindex set to -1', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect(await harness.hasListItemAttribute('tabIndex')).toBe('-1');
  })

  /**
   * If focus was on the menu button, Enter opens the menu, giving focus to the first menu item.
   */
  it('should place focus on first item when menu opens with Enter', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect((await harness.isListItemFocused(0))).toBeTruthy();
  })

  /**
   * If focus is on the menu itself, Escape closes the menu and returns focus to the menu button or parent menubar item
   */
  it('should close the menu when pressed Escape', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect(testWrapper.component().open()).toBe(true);
    await harness.pressKeyOnListItem('Escape', 0);
    expect(testWrapper.component().open()).toBe(false);
  })

  /**
   * If focus is on the menu itself, Escape closes the menu and returns focus to the menu button or parent menubar item
   */
  it('should return the focus to menu button when pressed Escape', async () => {
    await harness.pressKeyOnTrigger('Enter');
    await harness.isListItemFocused(0);
    await harness.pressKeyOnListItem('Escape', 0);
    expect(await harness.isTriggerFocused());
  })

  /**
   * Down Arrow
   * When focus is in a menu, moves focus to the next item, optionally wrapping from the last to the first.
   */
  it('should move focus to the next item when pressed arrow down', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect(await harness.isListItemFocused(0)).toBe(true);
    await harness.pressKeyOnListItem('ArrowDown', 0);
    expect(await harness.isListItemFocused(1)).toBe(true);
  })

  it('should wrap from the last to the first if no more items down the focused one and pressed arrow down', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect(await harness.isListItemFocused(0)).toBe(true);
    await harness.pressKeyOnListItem('ArrowDown', 0);
    await harness.pressKeyOnListItem('ArrowDown', 1);
    await harness.pressKeyOnListItem('ArrowDown', 2);
    expect(await harness.isListItemFocused(0)).toBe(true);
  })

  /**
   * Arrow Up
   * When focus is in a menu, moves focus to the previous item, optionally wrapping from the first to the last.
   */
  it('should move focus to the previous item when pressed arrow up', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect(await harness.isListItemFocused(0)).toBe(true);
    await harness.pressKeyOnListItem('ArrowUp', 0);
    await harness.pressKeyOnListItem('ArrowUp', 2);
    expect(await harness.isListItemFocused(1)).toBe(true);
  })

  it('should wrap from the first to the last if no more items up the focused one and pressed arrow up', async () => {
    await harness.pressKeyOnTrigger('Enter');
    expect(await harness.isListItemFocused(0)).toBe(true);
    await harness.pressKeyOnListItem('ArrowUp', 0);
    expect(await harness.isListItemFocused(2)).toBe(true);
  })
});

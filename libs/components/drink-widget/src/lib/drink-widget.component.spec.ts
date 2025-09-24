import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkWidgetComponent } from './drink-widget.component';
import { Component, viewChild } from '@angular/core';
import { Drink } from './drink.model';
import { DrinkWidgetComponentHarness } from './testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

@Component({
  selector: 'drink-widget-test-wrapper',
  imports: [DrinkWidgetComponent],
  template: `
   <drink-widget [drinks]="drinks" />
  `,
})
export class DrinkWidgetTestWrapper {
  component = viewChild.required(DrinkWidgetComponent);
  drinks: Drink[] = [
    { name: 'Coffee', isHot: true },
    { name: 'Cola', isHot: false },
    { name: 'Beer', isHot: false },
  ]
}

describe('DrinksComponent', () => {
  let testWrapper: DrinkWidgetTestWrapper;
  let fixture: ComponentFixture<DrinkWidgetTestWrapper>;
  let harness: DrinkWidgetComponentHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkWidgetTestWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkWidgetTestWrapper);
    testWrapper = fixture.componentInstance;
    harness = await TestbedHarnessEnvironment
      .loader(fixture)
      .getHarness(DrinkWidgetComponentHarness);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testWrapper).toBeTruthy();
  });
});

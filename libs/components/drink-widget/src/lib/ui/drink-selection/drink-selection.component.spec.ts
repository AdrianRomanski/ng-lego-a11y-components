import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, viewChild } from '@angular/core';
import { DrinkSelectionComponent } from './drink-selection.component';
import { DrinkSelectionComponentHarness } from './testing';
import { Drink } from '../../drink.model';

@Component({
  selector: 'drink-selection-test-wrapper',
  imports: [DrinkSelectionComponent],
  template: `
    <drink-selection
      [drink]="drink"
    />`,
})
export class DrinkSelectionTestWrapper {
  component = viewChild.required(DrinkSelectionComponent);
  drink: Drink = {name: 'Cola', isHot: false};
}
describe('DrinkListComponent', () => {
  let testWrapper: DrinkSelectionTestWrapper;
  let fixture: ComponentFixture<DrinkSelectionTestWrapper>;
  let harness: DrinkSelectionComponentHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkSelectionTestWrapper);
    harness = await TestbedHarnessEnvironment
      .loader(fixture)
      .getHarness(DrinkSelectionComponentHarness);
    testWrapper = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testWrapper).toBeTruthy();
  });
});

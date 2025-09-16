import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkSelectionComponent } from './drink-selection.component';
import { Component, viewChild } from '@angular/core';
import { DrinkComponent } from '../drink/drink.component';
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
  let component: DrinkSelectionComponent;
  let fixture: ComponentFixture<DrinkSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

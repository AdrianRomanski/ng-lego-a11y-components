import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkWidgetComponent } from './drink-widget.component';
import { Component, viewChild } from '@angular/core';

@Component({
  selector: 'drink-widget-test-wrapper',
  imports: [DrinkWidgetComponent],
  template: `
   <drink-widget [drinks]="drinks" />
  `,
})
export class DrinkWidgetTestWrapper {
  component = viewChild.required(DrinkWidgetComponent);
  drinks: [
    { name: 'Coffee', isHot: true },
    { name: 'Cola', isHot: false },
    { name: 'Beer', isHot: false },
  ]
}

describe('DrinksComponent', () => {
  let testWrapper: DrinkWidgetTestWrapper;
  let fixture: ComponentFixture<DrinkWidgetTestWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkWidgetTestWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkWidgetTestWrapper);
    testWrapper = fixture.componentInstance;
    fixture.detectChanges();
  });
});

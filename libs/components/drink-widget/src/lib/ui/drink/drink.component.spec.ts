import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { DrinkComponent } from './drink.component';

@Component({
  selector: 'drink-test-wrapper',
  imports: [DrinkComponent],
  template: `
    <drink
      hot=true
      name='Coffee'
    />`,
})
export class DrinkTestWrapper {
  component = viewChild.required(DrinkComponent);
}

describe('DrinkComponent', () => {
  let testWrapper: DrinkTestWrapper;
  let fixture: ComponentFixture<DrinkTestWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkTestWrapper);
    testWrapper = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testWrapper).toBeTruthy();
  });
});

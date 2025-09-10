import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinksComponent } from './drinks.component';
import { Component, viewChild } from '@angular/core';

@Component({
  selector: 'lego-components-drinks-test-wrapper',
  standalone: true,
  imports: [DrinksComponent],
  template: `
    <lego-components-drinks
      [drinks]="drinks">
    </lego-components-drinks>
  `
})
export class TestDrinksComponent {
    component = viewChild.required(DrinksComponent);

    drinks = [
      { name: 'Coffee', isHot: true },
      { name: 'Cola', isHot: false },
      { name: 'Beer', isHot: false },
  ]
}

describe('DrinksComponent', () => {
  let testWrapper: TestDrinksComponent;
  let fixture: ComponentFixture<TestDrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDrinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDrinksComponent);
    testWrapper = fixture.componentInstance;
    fixture.detectChanges();
  });
});

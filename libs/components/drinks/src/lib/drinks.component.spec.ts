import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinksComponent } from './drinks.component';

describe('DrinksComponent', () => {
  let component: DrinksComponent;
  let fixture: ComponentFixture<DrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

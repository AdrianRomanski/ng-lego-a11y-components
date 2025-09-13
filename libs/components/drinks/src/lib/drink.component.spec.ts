import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkComponent } from './drink.component';

describe('DrinkComponent', () => {
  let component: DrinkComponent;
  let fixture: ComponentFixture<DrinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkTextComponent } from './drink-text.component';

describe('DrinkTextComponent', () => {
  let component: DrinkTextComponent;
  let fixture: ComponentFixture<DrinkTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

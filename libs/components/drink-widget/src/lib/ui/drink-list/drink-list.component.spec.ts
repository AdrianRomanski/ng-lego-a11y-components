import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkListComponent } from './drink-list.component';

describe('DrinkComponent', () => {
  let component: DrinkListComponent;
  let fixture: ComponentFixture<DrinkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudsComponent } from './studs.component';

describe('StudsComponent', () => {
  let component: StudsComponent;
  let fixture: ComponentFixture<StudsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

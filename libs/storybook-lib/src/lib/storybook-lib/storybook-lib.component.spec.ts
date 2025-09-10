import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorybookLibComponent } from './storybook-lib.component';

describe('StorybookLibComponent', () => {
  let component: StorybookLibComponent;
  let fixture: ComponentFixture<StorybookLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorybookLibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorybookLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

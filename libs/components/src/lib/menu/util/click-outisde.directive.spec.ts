import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  imports: [ClickOutsideDirective],
  template: `
    <div
       appClickOutside
       (clickOutside)="onOutsideClick()">
    </div>`,
})
class TestComponent {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOutsideClick(): void {}
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[],
      imports: [TestComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit clickOutside when clicked outside', () => {
    const spy = jest.spyOn(component, 'onOutsideClick');
    document.body.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit clickOutside when clicked inside', () => {
    const spy = jest.spyOn(component, 'onOutsideClick');
    const div = fixture.nativeElement.querySelector('div');
    div.click();
    expect(spy).not.toHaveBeenCalled();
  });
});

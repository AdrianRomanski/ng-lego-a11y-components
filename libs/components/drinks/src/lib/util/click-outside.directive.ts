import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[legoComponentsClickOutside]'
})
export class ClickOutsideDirective {
  private readonly _elementRef = inject(ElementRef);

  public clickOutside = output<Event>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.clickOutside.emit(event);
    }
  }
}

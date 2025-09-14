import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[observeDocumentClick]'
})
export class ClickOutsideDirective {
  private readonly _elementRef = inject(ElementRef);

  public outsideClick = output<Event>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.outsideClick.emit(event);
    }
  }
}

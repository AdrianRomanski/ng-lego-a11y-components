import {
  ChangeDetectionStrategy,
  Component, effect, ElementRef,
  input,
  output, Signal,
  signal, viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './util/click-outside.directive';

export interface Drink {
  name: string;
  isHot: boolean;
}
@Component({
  selector: 'lego-components-drinks',
  imports: [CommonModule, ClickOutsideDirective],
  template: `
    <button
      #trigger
      id="drink-trigger"
      aria-haspopup="menu"
      aria-controls="drinks"
      aria-label="Best offer for drinks in office"
      class="content-trigger"
      legoComponentsClickOutside
      (clickOutside)="open.set(false)"
      (click)="open.set(!this.open())"
    >
      Best Offers
    </button>
    @if (open()) {
    <ul
      aria-labelledby="drink-trigger"
      #menu tabindex="0" role="menu" id="drinks" class="content-wrapper">
      @for (drink of drinks(); track drink.name) {
      <li
        tabindex="0"
        role="menuitem"
        class="content"
        (keydown)="onMenuItemKeyDown($event, drink)"
        (click)="onDrinkClick(drink)"
      >
        <span aria-hidden="true">{{drink.isHot ? '☕' : '🥤'}}</span>
        <span [attr.aria-label]="drink.isHot ? 'Please take care is very hot' : 'nicely and chilled'" class="content-text">
          {{ drink.name }}
        </span>
      </li>
      }
    </ul>
    }
  `,
  styleUrl: './drinks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinksComponent {
  menu: Signal<ElementRef | undefined> = viewChild('menu');
  trigger: Signal<ElementRef> = viewChild.required('trigger');

  drinks = input.required<Drink[]>();

  selectDrink = output<Drink>();

  open = signal(false);

  constructor() {
    effect(() => {
      if (this.open() && this.menu()) {
        this.listItems[0].focus();
      }
    });

  }

  protected onDrinkClick(drink: Drink): void {
    this.selectDrink.emit(drink);
    this.open.set(false);
  }

  protected onMenuItemKeyDown(event: KeyboardEvent, drink: Drink) {
    if(event.key === 'Tab') {
      this.open.set(false);
    } else {
      event.stopPropagation();
      event.preventDefault();

      let index = Array.from(this.listItems).indexOf(document.activeElement as HTMLLIElement);

      if(event.key === 'Enter' || event.key === ' ') {
        this.onDrinkClick(drink);
        this.trigger().nativeElement.focus();
      } else if (event.key === 'Escape') {
        this.open.set(false);
        this.trigger().nativeElement.focus();
      } else if (event.key === 'ArrowDown') {
        index = (index + 1) % this.listItems.length;
        this.listItems[index].focus();
      } else if (event.key === 'ArrowUp') {
        index = (index - 1 + this.listItems.length) % this.listItems.length;
        this.listItems[index].focus();
      }
    }
   }

  private get listItems() {
    return this.menu()?.nativeElement.querySelectorAll('li');
  }
}

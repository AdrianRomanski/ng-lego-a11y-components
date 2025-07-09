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
      aria-haspopup="menu"
      aria-controls="drinks"
      aria-label="Best Drink"
      legoComponentsClickOutside
      (clickOutside)="open.set(false)"
      (click)="open.set(!this.open())"
    >
      Best Offers
    </button>
    @if (open()) {
      <ul
        aria-label="Collection of my favorite drinks"
        [attr.aria-expanded]="open()"
        role="menu"
        id="drinks"
        tabindex="-1"
        #menu class="content-wrapper">
        @for (drink of drinks(); track drink.name) {
        <li
          role="menuitem"
          tabindex="-1"
          class="content"
          (keydown)="onListItemKeyDown($event, drink)"
          (click)="onDrinkClick(drink)"
        >
          <span aria-hidden="true">{{drink.isHot ? '☕' : '🥤'}}</span>
          <span [attr.aria-label]="drink.isHot
            ? 'Please take care the drink si very hot'
            : 'Nicely chilled'" class="content-text">
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
  trigger: Signal<ElementRef> = viewChild.required('trigger');
  menu: Signal<ElementRef | undefined> = viewChild('menu');

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

  private get listItems() {
    return this.menu()?.nativeElement.querySelectorAll('li');
  }

  onListItemKeyDown(event: KeyboardEvent, drink: Drink) {
    if(event.key === 'Tab') {
      this.open.set(false);
    } else {

      event.stopPropagation();
      event.preventDefault();

      let index = Array.from(this.listItems).indexOf(document.activeElement as HTMLLIElement);

      if(event.key === 'ArrowDown') {
        index = (index + 1) % this.listItems.length;
        this.listItems[index].focus();
      } else if (event.key === 'ArrowUp') {
        index = (index - 1 + this.listItems.length) % this.listItems.length;
        this.listItems[index].focus();
      } else if (event.key === 'Escape') {
        this.open.set(false);
        this.trigger().nativeElement.focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        this.onDrinkClick(drink);
        this.trigger().nativeElement.focus();
      }
    }
  }
}

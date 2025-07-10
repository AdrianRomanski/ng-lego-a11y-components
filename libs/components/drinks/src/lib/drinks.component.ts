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
      aria-label="Best Drinks"
      aria-haspopup="menu"
      aria-controls="drinks"
      legoComponentsClickOutside
      (clickOutside)="open.set(false)"
      (click)="open.set(!this.open())"
    >
      Offers
    </button>
    @if (open()) {
    <ul
      #menu
      tabindex="-1"
      aria-label="Collection of Drinks"
      [attr.aria-expanded]="open()"
      role="menu"
      id="drinks"
    >
      @for (drink of drinks(); track drink.name) {
      <li
        tabindex="-1"
        role="menuitem"
        (keydown)="onListItemKeyDown($event, drink)"
        (click)="onDrinkClick(drink)"
      >
        <span aria-hidden="true">
          {{ drink.isHot ? '☕' : '🥤' }}
        </span>
        <span
          [attr.aria-label]="
            drink.isHot ? 'Please take care its very hot' : 'Nicely and chilled'
          "
        >
          {{ drink.name }}
        </span>
      </li>
      }
    </ul>
    }
    <button>Food</button>
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

  protected onListItemKeyDown(event: KeyboardEvent, drink: Drink) {
    if(event.key === 'Tab') {
      this.open.set(false);
    } else {
      event.stopPropagation();
      event.preventDefault();

      let index = Array.from(this.listItems).indexOf(document.activeElement as HTMLLIElement);

      if(event.key === 'ArrowDown') {
        index = (index + 1) % this.listItems.length;
        this.listItems[index].focus();
      } else if (event.key === 'ArrowUp'){
        index = (index -1 + this.listItems.length) % this.listItems.length;
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

  private get listItems() {
    return this.menu()?.nativeElement.querySelectorAll('li');
  }
}

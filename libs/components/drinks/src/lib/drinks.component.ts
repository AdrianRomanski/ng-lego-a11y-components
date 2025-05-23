import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  output,
  signal,
  Signal,
  viewChild,
  WritableSignal
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
      aria-controls="drink-menu"
      aria-haspopup="menu"
      class="content-trigger"
      legoComponentsClickOutside
      (clickOutside)="open.set(false)"
      (click)="open.set(!this.open())"
    >
      Best Offers
    </button>
    @if (open()) {
    <ul
      tabindex="-1"
      #menu
      aria-label="Collection of drinks"
      role="menu"
      id="drink-menu"
      class="content-wrapper"
    >
      @for (drink of drinks(); track drink.name) {
      <li
        (keydown)="onListItemKeyDown($event, drink)"
        role="menuitem"
        tabindex="-1"
        [attr.aria-label]="drink.isHot ? 'Please take care its very hot' : 'Nicely chilled'"
        class="content" (click)="onDrinkClick(drink)">
        <span aria-hidden="true">{{drink.isHot ? '☕' : '🥤'}}</span>
        <span class="content-text">
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

  drinks: Signal<Drink[]> = signal([
    { name: 'Coffee', isHot: true },
    { name: 'Cola', isHot: false },
    { name: 'Beer', isHot: false },
  ]);

  open: WritableSignal<boolean> = signal(false);

  selectDrink = output<Drink>();

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

  protected onListItemKeyDown(event: KeyboardEvent, drink: Drink) {
    let index = Array.from(this.listItems).indexOf(document.activeElement as HTMLElement);

    if(event.key === 'Tab') {
      this.open.set(false);
    } else {
      event.stopPropagation();
      event.preventDefault();
      if(event.key === 'Escape') {
        this.open.set(false);
        this.trigger().nativeElement.focus();
      } else if (event.key === ' ' || event.key === 'Enter') {
        this.onDrinkClick(drink);
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
}

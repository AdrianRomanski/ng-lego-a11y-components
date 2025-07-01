import {
  ChangeDetectionStrategy,
  Component, effect, ElementRef,
  output,
  signal,
  Signal, viewChild,
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
      aria-haspopup="menu"
      aria-controls="drinks"
      aria-label="Best Drinks in Wroclaw"
      legoComponentsClickOutside
      (clickOutside)="open.set(false)"
      (click)="open.set(!this.open())"
    >
      Cheap
    </button>
    @if (open()) {
      <ul
        #menu
        aria-label="Great Drinks"
        tabindex="-1"
        role="menu"
        id="drinks">
        @for (drink of drinks(); track drink.name) {
        <li
          (keydown)="onListItemKeyDown($event, drink)"
          tabindex="-1"
          role="menuitem"
          (click)="onDrinkClick(drink)">
          <span aria-hidden="true">{{drink.isHot ? '☕' : '🥤'}}</span>
          <span [attr.aria-label]="drink.isHot
          ? 'Please take care this is very hot'
          : 'Nicely chilled'" class="content-text">{{
            drink.name
          }}</span>
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

  drinks: Signal<Drink[]> = signal([
    { name: 'Coffee', isHot: true },
    { name: 'Cola', isHot: false },
    { name: 'Beer', isHot: false },
  ]);

  open: WritableSignal<boolean> = signal(false);

  selectDrink = output<Drink>();

  constructor() {
    effect(() => {
      if(this.open() && this.menu()) {
        this.menu()?.nativeElement.querySelectorAll('li')[0].focus();
      }
    });
  }

  protected onDrinkClick(drink: Drink): void {
    this.selectDrink.emit(drink);
    this.open.set(false);
  }

  protected onListItemKeyDown(event: KeyboardEvent, drink: Drink): void {
    event.stopPropagation();
    event.preventDefault();

    const listItems = this.menu()?.nativeElement.querySelectorAll('li');

    let index = Array.from(listItems).indexOf(document.activeElement as HTMLLIElement);

    if(event.key === 'Enter' || ' ') {
      this.onDrinkClick(drink);
      this.trigger()?.nativeElement.focus();
    } else if (event.key === 'Escape') {
      this.trigger()?.nativeElement.focus();
    } else if (event.key === 'ArrowDown') {
      index = (index + 1) % listItems.length
      listItems[index].focus();
    }
  }
}

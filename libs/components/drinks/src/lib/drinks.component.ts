import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
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
    <span
      class="content-trigger"
      legoComponentsClickOutside
      (clickOutside)="open.set(false)"
      (click)="open.set(!this.open())"
    >
      Best Drinks
    </span>
    @if (open()) {
    <div
      class="content-wrapper"
    >
      @for (drink of drinks(); track drink.name) {
        <div
          class="content"
          (click)="onDrinkClick(drink)"
        >
          <span
            class="content-text"
            [ngClass]="drink.isHot ? 'hot' : 'cold'"
          >
            {{drink.name }}
          </span>
        </div>
      }
    </div>
    }
  `,
  styleUrl: './drinks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinksComponent {
  drinks = input.required<Drink[]>();

  selectDrink = output<Drink>();

  open = signal(false);

  protected onDrinkClick(drink: Drink): void {
    this.selectDrink.emit(drink);
    this.open.set(false);
  }
}

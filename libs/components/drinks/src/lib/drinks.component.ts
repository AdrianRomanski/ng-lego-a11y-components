import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  Signal,
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
    <span
      class="content-trigger"
      legoComponentsClickOutside
      (clickOutside)="open.set(false)"
      (click)="open.set(!this.open())"
    >
      Best Drinks
    </span>
    @if (open()) {
    <div class="content-wrapper">
      @for (drink of drinks(); track drink.name) {
      <div class="content" (click)="onDrinkClick(drink)">
        <span [ngClass]="drink.isHot ? 'hot' : 'cold'" class="content-text">{{
          drink.name
        }}</span>
      </div>
      }
    </div>
    }
  `,
  styleUrl: './drinks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinksComponent {
  drinks: Signal<Drink[]> = signal([
    { name: 'Coffee', isHot: true },
    { name: 'Cola', isHot: false },
    { name: 'Beer', isHot: false },
  ]);

  open: WritableSignal<boolean> = signal(false);

  selectDrink = output<Drink>();

  protected onDrinkClick(drink: Drink): void {
    this.selectDrink.emit(drink);
    this.open.set(false);
  }
}

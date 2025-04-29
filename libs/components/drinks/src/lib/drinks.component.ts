import {
  ChangeDetectionStrategy,
  Component, output,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Drink {
  name: string;
  isHot: boolean;
}
@Component({
  selector: 'lego-components-drinks',
  imports: [CommonModule],
  template: `
    <span class="content-trigger" (click)="open.set(true)">
      Best Drinks
    </span>
    @if (open()) {
      <div class="content-wrapper">
        @for (drink of drinks(); track drink.name) {
          <div class="content" (click)="onDrinkClick(drink)">
            <span
              [ngClass]="drink.isHot ? 'hot' : 'cold'"
              class="content-text">{{ drink.name }}</span>
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

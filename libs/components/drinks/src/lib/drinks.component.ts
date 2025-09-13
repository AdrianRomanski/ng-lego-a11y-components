import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  model,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../src/util/click-outside.directive';
import { DrinkComponent } from './drink.component';

export type DrinkSelectionMode = 'span' | 'checkbox' | 'radio';

export interface Drink {
  name: string;
  isHot: boolean;
  isSelected?: boolean;
}
@Component({
  selector: 'lego-components-drinks',
  imports: [CommonModule, ClickOutsideDirective, DrinkComponent],
  template: `
    <div legoComponentsClickOutside (clickOutside)="open.set(false)">
      <span class="content-trigger" (click)="open.set(!this.open())">
        Best Drinks
      </span>
      @if (open()) {
        <div class="content-wrapper">
          @for (drink of localDrinks(); track drink.name) {
            <lego-components-drink
              [drink]="drink"
              [selectionMode]="selectionMode()"
              (drinkClick)="onDrinkClick($event)">
            </lego-components-drink>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './drinks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinksComponent {
  drinks = model.required<Drink[]>();
  selectionMode = input<DrinkSelectionMode>('span');

  open = signal(false);
  localDrinks = linkedSignal<Drink[]>(this.drinks);

  protected onDrinkClick(drink: Drink): void {
    switch (this.selectionMode()) {
      case 'span': {
       this.open.set(false);
       break;
      }
      case 'radio': {
        this.localDrinks.update(drinks =>
          drinks.map(d => ({ ...d, isSelected: d.name === drink.name }))
        );
        break;
      }
      case 'checkbox': {
        this.localDrinks.update(drinks =>
          drinks.map(d =>
            d.name === drink.name ? { ...d, isSelected: !d.isSelected } : d
          )
        );
        break;
      }
    }
    this.drinks.set(this.localDrinks().filter((d) => d.isSelected));
  }
}

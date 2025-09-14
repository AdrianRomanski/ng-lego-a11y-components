import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../src/util/click-outside.directive';
import { DrinkListComponent } from './ui/drink-list/drink-list.component';
import { Drink, DrinkSelectionMode } from './drink.model';

@Component({
  selector: 'drink-widget',
  imports: [CommonModule, ClickOutsideDirective, DrinkListComponent],
  template: `
    <div observeDocumentClick
         (outsideClick)="open.set(false)"
    >
      <span class="content-trigger" (click)="open.set(!this.open())">
        Best Drinks
      </span>
      @if (open()) {
        <div class="content-wrapper">
          @for (drink of localDrinks(); track drink.name) {
            <drink-list
              [drink]="drink"
              [selectionMode]="selectionMode()"
              (drinkClick)="onDrinkClick($event)">
            </drink-list>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './drink-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinkWidget {
  drinks = input.required<Drink[]>();
  selectionMode = input<DrinkSelectionMode>('checkbox');

  open = signal(false);
  localDrinks = linkedSignal<Drink[]>(this.drinks);

  drinksSelected = output<Drink[]>();

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
    this.drinksSelected.emit(this.localDrinks().filter((d) => d.isSelected));
  }
}

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
import { DrinkSelectionComponent } from './ui/drink-selection/drink-selection.component';
import { Drink, DrinkSelectionMode } from './drink.model';

@Component({
  selector: 'drink-widget',
  imports: [CommonModule, ClickOutsideDirective, DrinkSelectionComponent],
  template: `
    <div observeDocumentClick
         (outsideClick)="open.set(false)"
    >
      <button
        id="drinks-trigger"
        aria-label="Best Drinks"
        aria-controls="drinks-menu"
        aria-haspopup="menu"
        class="content-trigger" (click)="open.set(!this.open())">
      </button>
      @if (open()) {
        <ul
          aria-labelledby="drinks-trigger"
          role="menu"
          id="drinks-menu"
          class="content-wrapper">
          @for (drink of localDrinks(); track drink.name) {
            <drink-selection
              [drink]="drink"
              [selectionMode]="selectionMode()"
              (drinkClick)="onDrinkClick($event)">
            </drink-selection>
          }
        </ul>
      }
    </div>
  `,
  styleUrl: './drink-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinkWidgetComponent {
  drinks = input.required<Drink[]>();
  selectionMode = input<DrinkSelectionMode>('checkbox');

  open = signal(false);
  localDrinks = linkedSignal<Drink[]>(this.drinks);

  drinksSelected = output<Drink[]>();

  protected onDrinkClick(drink: Drink): void {
    switch (this.selectionMode()) {
      case 'default': {
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

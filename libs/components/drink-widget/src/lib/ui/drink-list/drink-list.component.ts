import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrinkComponent } from '../drink/drink.component';
import { Drink, DrinkSelectionMode } from '../../drink.model';

@Component({
  selector: 'drink-list',
  imports: [CommonModule, DrinkComponent],
  template: `
    <div (click)="onDrinkClick(drink())" class="content">
      @if (selectionMode() === 'checkbox') {
      <input
        type="checkbox"
        class="custom-checkbox"
        readonly
        [checked]="drink().isSelected"
      />
      } @else if (selectionMode() === 'radio') {
      <input
        type="radio"
        class="custom-radio"
        readonly
        [checked]="drink().isSelected"
      />
      }
      <lego-components-drink [name]="drink().name" [hot]="drink().isHot" />
    </div>
  `,
  styleUrl: './drink-list.component.scss',
})
export class DrinkListComponent {
  drink = input.required<Drink>();
  selectionMode = input<DrinkSelectionMode>('radio');

  drinkClick = output<Drink>();

  onDrinkClick(drink: Drink): void {
    this.drinkClick.emit(drink);
  }
}

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrinkComponent } from '../drink/drink.component';
import { Drink, DrinkSelectionMode } from '../../drink.model';

@Component({
  selector: 'drink-selection',
  imports: [CommonModule, DrinkComponent],
  template: `
    <li
      role="menuitemcheckbox"
      (click)="onDrinkClick(drink())" class="content">
      @if (selectionMode() != 'default') {
        <input
          [type]="selectionMode()"
          [checked]="drink().isSelected"
        />
      }
      <drink
        [name]="drink().name"
        [hot]="drink().isHot"
      />
    </li>
  `,
  styleUrl: './drink-selection.component.scss',
})
export class DrinkSelectionComponent {
  drink = input.required<Drink>();
  selectionMode = input<DrinkSelectionMode>('radio');

  drinkClick = output<Drink>();

  onDrinkClick(drink: Drink): void {
    this.drinkClick.emit(drink);
  }
}

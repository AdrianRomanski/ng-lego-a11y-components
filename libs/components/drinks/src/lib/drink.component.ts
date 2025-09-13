import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Drink, DrinkSelectionMode } from '@ng-lego/components/drinks';
import { DrinkTextComponent } from './drink-text.component';

@Component({
  selector: 'lego-components-drink',
  imports: [CommonModule, DrinkTextComponent],
  template: `
    <div (click)="onDrinkClick(drink())" class="content">
      @if (selectionMode() === 'checkbox') {
        <input type="checkbox" class="custom-checkbox" readonly [checked]="drink().isSelected" />
      } @else if (selectionMode() === 'radio') {
        <input type="radio" class="custom-radio" readonly [checked]="drink().isSelected" />
      }
      <lego-components-drink-text
        [name]="drink().name"
        [hot]="drink().isHot"
      />
    </div>
  `,
  styleUrl: './drink.component.scss',
})
export class DrinkComponent {
  drink = input.required<Drink>();
  selectionMode = input<DrinkSelectionMode>('radio');

  drinkClick = output<Drink>()

  onDrinkClick(drink: Drink): void {
    this.drinkClick.emit(drink);
  }
}

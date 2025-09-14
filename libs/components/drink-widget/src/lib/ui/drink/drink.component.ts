import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'drink',
  imports: [CommonModule],
  template: `<span [ngClass]="hot() ? 'hot' : 'cold'">
              {{ name() }}
             </span>`,
  styleUrl: './drink.component.scss',
})
export class DrinkComponent {
  hot = input.required<boolean>();
  name = input.required<string>();
}

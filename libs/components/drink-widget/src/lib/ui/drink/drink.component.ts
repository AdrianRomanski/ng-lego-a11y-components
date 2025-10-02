import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'drink',
  imports: [CommonModule],
  template: `
            <p>
              <span aria-hidden="true">{{hot() ? '🔥' : '🧊'}}</span>
              <strong [attr.aria-label]="hot() ? 'Is very hot' : 'Nicely and chilled'"></strong>
              {{ name() }}
            </p>
              `,
  styleUrl: './drink.component.scss',
})
export class DrinkComponent {
  hot = input.required<boolean>();
  name = input.required<string>();
}

import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'drink',
  imports: [CommonModule],
  template: `
         <p>
           <strong [attr.aria-label]="hot()
            ? 'Take care is very hot'
            : 'Chilled'">
           </strong>
           <span aria-hidden="true">{{hot() ? '🔥' : '🧊'}}</span>
           {{ name() }}
         </p>
           `,
  styleUrl: './drink.component.scss',
})
export class DrinkComponent {
  hot = input.required<boolean>();
  name = input.required<string>();
}

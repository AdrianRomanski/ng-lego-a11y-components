import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

// status role? :)
@Component({
  selector: 'lego-components-drink-text',
  imports: [CommonModule],
  template: `<span
               class="content-text"
               [ngClass]="hot() ? 'hot' : 'cold'">
                {{ name() }}
             </span>`,
  styleUrl: './drink-text.component.scss',
})
export class DrinkTextComponent {
  hot = input.required<boolean>();
  name = input.required<string>();
}

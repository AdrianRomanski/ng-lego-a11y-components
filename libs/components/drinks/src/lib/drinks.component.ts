import { ChangeDetectionStrategy, Component, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Drink {
  name: string;
}

@Component({
  selector: 'lego-components-drinks',
  imports: [CommonModule],
  template: `
     <button>
       Perfect Drinks
     </button>
     <ul>
       @for (drink of drinks(); track drink.name) {
         <li>{{drink.name}}</li>
       }
     </ul>
  `,
  styleUrl: './drinks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinksComponent {
  drinks: Signal<Drink[]> = signal([
    {name: 'Cola'},
    {name: 'Coffee'},
    {name: 'Beer'}
  ])
}

import { ChangeDetectionStrategy, Component, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Drink {
  name: string;
  isHot: boolean;
}

@Component({
  selector: 'lego-components-drinks',
  imports: [CommonModule],
  template: `
    <button
    aria-controls="drinks-menu"
    aria-haspopup="menu"
    (keydown)="onTriggerKeydown($event)"
    id="drinks-menu-trigger">
      Best Offers
    </button>
    @if (open()) {
      <ul
        aria-label="Best offers in the town"
        role="menu"
        id="drinks-menu">
        @for (drink of drinks(); track drink.name) {
          <li role="presentation">
            <span aria-hidden="true">{{drink.isHot ? '☕' : '🥤'}}</span>
            <span role="listitem"
              [attr.aria-label]="
                drink.isHot
                ? 'Please take care the drink can be very hot'
                : 'Nicely chilled'"
            >
              {{drink.name}}</span>
          </li>
        }
      </ul>
    }
  `,
  styleUrl: './drinks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrinksComponent {
  open: WritableSignal<boolean> = signal(false);

  drinks: Signal<Drink[]> = signal([
    {name: 'Coffee', isHot: true},
    {name: 'Beer', isHot: false},
    {name: 'Cola', isHot: false}
  ])

  protected onTriggerKeydown(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      this.open.set(!this.open());
    }
  }
}

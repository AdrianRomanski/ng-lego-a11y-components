import {
  ChangeDetectionStrategy,
  Component, effect, ElementRef,
  input,
  linkedSignal,
  output, Signal,
  signal, viewChild
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
          id="trigger"
          aria-label="Best Cheap Drinks"
          aria-controls="menu"
          aria-haspopup="menu"
          class="content-trigger"
          (click)="open.set(!this.open())"
      >
      </button>
      @if (open()) {
        <ul
          tabindex="-1"
          #menu
          aria-labelledby="trigger"
          id="menu"
          role="menu"
          class="content-wrapper">
          @for (drink of localDrinks(); track drink.name) {
            <drink-selection
              [drink]="drink"
              [selectionMode]="selectionMode()"
              (drinkClick)="onDrinkClick($event)"
              (keydown)="onDrinkKeyDown($event)"
            >
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
  menu: Signal<ElementRef | undefined> = viewChild('menu');

  drinks = input.required<Drink[]>();
  selectionMode = input<DrinkSelectionMode>('checkbox');

  open = signal(false);
  localDrinks = linkedSignal<Drink[]>(this.drinks);

  drinksSelected = output<Drink[]>();

  constructor() {
    effect(() => {
      if(this.open() && this.menu()) {
        this.menu()?.nativeElement.querySelectorAll('li')[0].focus();
      }
    });
  }

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

  protected onDrinkKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();

    let index = Array.from(this.getItems())
      .indexOf(document.activeElement as HTMLLIElement);

    if(event.key === 'ArrowDown') {
      index = (index + 1) % this.getItems().length;
      this.getItems()[index].focus();
    } else if (event.key === 'ArrowUp') {
      index = (index - 1 + this.getItems().length) % this.getItems().length;
      this.getItems()[index].focus();
    }


  }

  private getItems() {
    return this.menu()?.nativeElement.querySelectorAll('li');
  }
}

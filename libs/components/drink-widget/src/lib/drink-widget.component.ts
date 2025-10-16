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
        aria-label="Best Drinks"
        aria-controls="menu"
        aria-haspopup="menu"
        #trigger
        class="content-trigger" (click)="open.set(!this.open())">
      </button>
      @if (open()) {
        <ul
          aria-labelledby="trigger"
          role="menu"
          id="menu"
          tabindex="-1"
          #menu
          class="content-wrapper">
          @for (drink of localDrinks(); track drink.name) {
            <drink-selection
              [drink]="drink"
              [selectionMode]="selectionMode()"
              (drinkClick)="onDrinkClick($event)"
              (keydown)="onListItemKeyDown($event, drink)"
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
  trigger: Signal<ElementRef> = viewChild.required('trigger');

  drinks = input.required<Drink[]>();
  selectionMode = input<DrinkSelectionMode>('checkbox');

  open = signal(false);
  localDrinks = linkedSignal<Drink[]>(this.drinks);

  drinksSelected = output<Drink[]>();

  constructor() {
    effect(() => {
      if(this.open() && this.menu()) {
        (this.listItems())[0].focus();
      }
    });
  }

  private listItems() {
    return this.menu()?.nativeElement.querySelectorAll('li');
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

  protected onListItemKeyDown(event: KeyboardEvent, drink: Drink) {


    if(event.key === 'Tab') {
      this.open.set(false);
    } else {
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();

      let index = Array.from(this.listItems()).indexOf(document.activeElement as HTMLLIElement);

      if(event.key === 'ArrowDown') {
        index = (index + 1) % this.listItems().length;
        this.listItems()[index].focus();
      } else if (event.key === 'ArrowUp') {
        index = (index - 1 + this.listItems().length) % this.listItems().length;
        this.listItems()[index].focus();
      } else if (event.key === 'Enter') {
        this.onDrinkClick(drink);
        this.open.set(false);
        this.trigger().nativeElement.focus();
      }
    }


  }
}

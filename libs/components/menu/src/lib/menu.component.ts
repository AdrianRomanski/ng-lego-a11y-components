import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
  Signal,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './menu-list';
import { closeAllSubmenus } from './util/menu.functions';
import { ClickOutsideDirective } from './util/click-outside.directive';
import { StudsComponent } from '@ng-lego/ui';

export interface MenuItem {
  label: string;
  isOpen?: boolean;
  disabled?:boolean;
  submenu?: MenuItem[];
}

export interface SelectChange {
  focusFirst?: boolean;
  item?: MenuItem;
  focusIndex?: number;
}

@Component({
  selector: 'lego-components-components-menu',
  imports: [
    CommonModule,
    StudsComponent,
    MenuListComponent,
    ClickOutsideDirective,
  ],
  template: `
      <button
        class="lego-brick realistic"
        aria-label="Zones"
        aria-haspopup="true"
        [attr.aria-expanded]="isOpen()"
        legoComponentsClickOutside
        (clickOutside)="onOutsideClick($event)"
        (click)="onMenuTriggerClick()"
        (keydown)="onMenuTriggerKeyDown($event)">
        <lego-ui-studs/>
      </button>
      @if (isOpen()) {
        <lego-components-menu-list
          #menuList
          [isTopList]="true"
          [menuItems]="items()"
          (openChange)="onOpenChange($event)"
        >
        </lego-components-menu-list>
      }
  `,
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  public menuListComponent: Signal<MenuListComponent | undefined> =
    viewChild<MenuListComponent>('menuList');

  public menuItems = input.required<MenuItem[]>();

  public selectItem = output<string>();

  public isOpen = signal(false);
  public items = signal<MenuItem[]>([]);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.menuListComponent()?.focusListItem(0);
      }
    });
    effect(() => {
      this.items.set(this.menuItems());
    });
  }

  protected onMenuTriggerClick(): void {
    this.isOpen.set(!this.isOpen());
  }

  protected onMenuTriggerKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') {
      this.isOpen.set(!this.isOpen());
    }
  }

  protected onOutsideClick(event: Event): void {
    event.stopPropagation();
    this.isOpen.set(false);
  }

  protected onOpenChange(selectChange: SelectChange): void {
    if (selectChange.item) {
      this.selectItem.emit(selectChange.item.label);
    }
    this.items.set(closeAllSubmenus(this.items()));
    if (selectChange.focusFirst) {
      this.menuListComponent()?.focusListItem(selectChange.focusIndex || 0);
    } else {
      this.isOpen.set(false);
    }
  }
}

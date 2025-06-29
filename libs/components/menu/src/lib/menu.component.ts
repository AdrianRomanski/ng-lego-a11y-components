import {
  ChangeDetectionStrategy,
  Component,
  effect, ElementRef,
  input,
  linkedSignal,
  output,
  signal,
  Signal,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuListComponent } from './menu-list';
import { closeAllSubmenus } from './util/submenu.functions';
import { MenuItem, SelectChange } from './util/menu.model';

import { StudsComponent } from '@ng-lego/ui';
import { ClickOutsideDirective } from '@ng-lego/util/directives';

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
      #trigger
      aria-label="Zones"
      aria-haspopup="true"
      [attr.aria-expanded]="isOpen()"
      legoUtilClickOutside
      (clickOutside)="onOutsideClick($event)"
      (click)="onMenuTriggerClick()"
      (keydown)="onMenuTriggerKeyDown($event)"
    >
      <lego-ui-studs />
    </button>
    @if (isOpen()) {
      <lego-components-menu-list
        #menuList
        [topList]="true"
        [initialItems]="items()"
        (selectChange)="onOpenChange($event)"
      />
    }
  `,
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  public menuListComponent: Signal<MenuListComponent | undefined> =
    viewChild<MenuListComponent>('menuList');
  public trigger = viewChild.required<ElementRef>('trigger');

  public menuItems = input.required<MenuItem[]>();

  public selectItem = output<string>();

  public isOpen = signal(false);

  public items = linkedSignal(() => this.menuItems());

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.menuListComponent()?.focusListItem(0);
      }
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
    this.items.set(closeAllSubmenus(this.items()));
  }

  protected onOpenChange(selectChange: SelectChange): void {
    if (selectChange.item) {
      this.selectItem.emit(selectChange.item.label);
    }
    if(selectChange.focusTrigger) {
      this.trigger().nativeElement.focus();
    }
    this.items.set(closeAllSubmenus(this.items()));
    if (selectChange.focusFirst) {
      this.menuListComponent()?.focusListItem(selectChange.focusIndex || 0);
    } else {
      this.isOpen.set(false);
    }
  }
}

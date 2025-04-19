import { ComponentHarness } from '@angular/cdk/testing';
import { MenuListComponentHarness } from '../menu-list';

export class MenuComponentHarness extends ComponentHarness {
  static hostSelector = 'lego-components-components-menu';

  private get button() {
    return this.locatorFor('button');
  }

  private get menuListHarness() {
    return this.locatorFor(MenuListComponentHarness)
  }

  /** Mouse */
  async clickButton(): Promise<void> {
    await (await this.button()).click();
  }

  async clickSubmenu(): Promise<void> {
    return (await (await this.menuListHarness()).getItems())[2].click()
  }

  async clickItem(index: number): Promise<void> {
    return (await (await this.menuListHarness()).getItems())[index].click()
  }

  async clickOnSubListItem(index: number): Promise<void> {
    return (await this.menuListHarness()).clickOnSubListItem(index);
  }

  async clickOutside(): Promise<void> {
    document.body.click();
  }

  /** Keyboard */
  async pressKeyOnListItem(key: string, index: number): Promise<void> {
    return (await this.menuListHarness()).pressKeyOnListItem(key, index);
  }

  async pressKeyInSubmenu(key: string, index: number): Promise<void> {
    return (await this.menuListHarness()).pressKeyOnSubListItem(key, index);
  }

  async pressKeyOnMenuButton(key: string): Promise<void> {
    return (await this.button()).dispatchEvent('keydown', { key });
  }

  /** Focus */
  async isItemFocused(itemIndex: number): Promise<boolean> {
    return (await (await this.menuListHarness()).getItems())[itemIndex].isFocused();
  }
}

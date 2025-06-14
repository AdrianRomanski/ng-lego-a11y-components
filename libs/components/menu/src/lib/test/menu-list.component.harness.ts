import { ComponentHarness, TestElement } from '@angular/cdk/testing';

export class MenuListComponentHarness extends ComponentHarness {
  static hostSelector = 'lego-components-menu-list';

  private get menuListHarness() {
    return this.locatorFor(MenuListComponentHarness)
  }

  private get list() {
    return this.locatorFor('ul');
  }

  private get items() {
    return this.locatorForAll('li');
  }

  async getList(): Promise<TestElement> {
    return this.list();
  }

  async getItems(): Promise<TestElement[]> {
    return this.items();
  }

  async getSubmenu(): Promise<MenuListComponentHarness> {
    return this.menuListHarness();
  }

  /**  Mouse */
  async clickSubmenu(): Promise<void> {
    return (await this.items())[3].click();
  }

  async clickOnSubListItem(index: number) {
    return (await (await this.menuListHarness()).items())[index].click();
  }

  /** Keyboard */
  async pressKeyOnListItem(key: string, index: number) {
    return (await this.items())[index].dispatchEvent('keydown', { key });
  }

  async pressKeyOnSubListItem(key: string, index: number) {
    return (await (await this.menuListHarness()).items())[index].dispatchEvent('keydown', { key });
  }

  async pressKeyOnFocusedItem(key: string): Promise<void> {
    const items = await this.items();
    for (const item of items) {
      if (await item.matchesSelector(':focus')) {
        await item.dispatchEvent('keydown', { key });
        return;
      }
    }
  }

  /** Focus */
  async isItemFocused(index: number): Promise<boolean> {
    return (await this.items())[index].isFocused();
  }

  async focusItem(index: number): Promise<void> {
    return (await this.items())[index].focus();
  }
}

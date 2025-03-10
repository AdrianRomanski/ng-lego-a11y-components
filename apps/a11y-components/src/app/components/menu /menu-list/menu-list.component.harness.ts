import { ComponentHarness, TestElement } from '@angular/cdk/testing';

export class MenuListComponentHarness extends ComponentHarness {
  static hostSelector = 'app-menu-list';

  private get menuListHarness() {
    return this.locatorFor(MenuListComponentHarness)
  }

  private get menuList() {
    return this.locatorFor('ul');
  }

  private get menuItems() {
    return this.locatorForAll('li');
  }

  async getLists(): Promise<TestElement> {
    return this.menuList();
  }

  async getItems(): Promise<TestElement[]> {
    return this.menuItems();
  }

  async getSubmenu(): Promise<MenuListComponentHarness> {
    return this.menuListHarness();
  }

  async clickSubmenu(): Promise<void> {
    const item = (await this.menuItems())[2];
    await item.click();
  }

  async focusElement(index: number) {
    const element = (await this.menuItems())[index];
    return element.focus();
  }

  async pressKeyOnListItem(key: string, index: number) {
    const element = (await this.menuItems())[index];
    await element.dispatchEvent('keydown', { key });
  }

  async pressKeyOnSubListItem(key: string, index: number) {
    const menuList = (await this.menuListHarness());
    const elements = await menuList.menuItems()
    await elements[index].dispatchEvent('keydown', { key });
  }

  async clickOnSubListItem(index: number) {
    const menuList = (await this.menuListHarness());
    const elements = await menuList.menuItems();
    await elements[index].click();
  }

  async pressKeyOnFocusedItem(key: string): Promise<void> {
    const items = await this.menuItems();
    for (const item of items) {
      if (await item.matchesSelector(':focus')) {
        await item.dispatchEvent('keydown', { key });
        return;
      }
    }
  }

  async isItemFocused(index: number): Promise<boolean> {
    const element = (await this.menuItems())[index];
    return element.isFocused();
  }
}

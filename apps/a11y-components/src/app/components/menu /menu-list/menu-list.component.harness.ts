import { ComponentHarness, TestElement } from '@angular/cdk/testing';

export class MenuListComponentHarness extends ComponentHarness {
  static hostSelector = 'app-menu-list';

  private get menuList() {
    return this.locatorForAll('ul');
  }

  private get menuItems() {
    return this.locatorForAll('li');
  }

  async getLists(): Promise<TestElement[]> {
    return this.menuList();
  }

  async getItems(): Promise<TestElement[]> {
    return this.menuItems();
  }

  async clickSubmenu(): Promise<void> {
    const item = (await this.menuItems())[2];
    await item.click();
  }
}

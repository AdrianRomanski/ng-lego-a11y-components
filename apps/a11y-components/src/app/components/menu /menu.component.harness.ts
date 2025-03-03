import { ComponentHarness, TestElement } from '@angular/cdk/testing';

export class MenuComponentHarness extends ComponentHarness {
  static hostSelector = 'app-components-menu';

  private get menuButton() {
    return this.locatorFor('button');
  }

  private get menuList() {
    return this.locatorForAll('ul');
  }

  private get menuItems() {
    return this.locatorForAll('li');
  }

  async getLists(): Promise<TestElement[]> {
    return this.menuList();
  }

  async toggleMenu(): Promise<void> {
    await (await this.menuButton()).click();
  }

  async clickSubmenu(): Promise<void> {
    const item = (await this.menuItems())[2];
    await item.click();
  }

  async clickItem(itemIndex: number): Promise<void> {
    const item = (await this.menuItems())[itemIndex];
    await item.click();
  }
}

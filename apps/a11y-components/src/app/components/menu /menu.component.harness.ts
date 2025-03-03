import { ComponentHarness } from '@angular/cdk/testing';

export class MenuComponentHarness extends ComponentHarness {
  static hostSelector = 'app-components-menu';

  private get menuButton() {
    return this.locatorFor('button');
  }

  private get menuList() {
    return this.locatorFor('ul');
  }

  private get menuItems() {
    return this.locatorForAll('li');
  }

  async toggleMenu(): Promise<void> {
    await (await this.menuButton()).click();
  }

  async getMenuItemCount(): Promise<number> {
    const items = await this.menuItems();
    return items?.length;
  }

  async openSubmenu(itemIndex: number): Promise<void> {
    const item = (await this.menuItems())[itemIndex];
    await item.click();
  }

  async closeSubmenu(itemIndex: number): Promise<void> {
    const item = (await this.menuItems())[itemIndex];
    await item.click();
  }

  async getMenuItemLabel(itemIndex: number): Promise<string> {
    const item = (await this.menuItems())[itemIndex];
    return (await item.text()).trim();
  }
}

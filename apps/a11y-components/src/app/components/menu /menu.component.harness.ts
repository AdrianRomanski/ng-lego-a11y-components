import { ComponentHarness } from '@angular/cdk/testing';
import { MenuListComponentHarness } from './menu-list';

export class MenuComponentHarness extends ComponentHarness {
  static hostSelector = 'app-components-menu';

  private get menuButton() {
    return this.locatorFor('button');
  }

  private get menuListHarness() {
    return this.locatorFor(MenuListComponentHarness)
  }

  async toggleMenu(): Promise<void> {
    await (await this.menuButton()).click();
  }

  async clickSubmenu(): Promise<void> {
    const menuList = await this.menuListHarness();
    const item = (await menuList.getItems())[2];
    await item.click();
  }

  async clickItem(itemIndex: number): Promise<void> {
    const menuList = await this.menuListHarness();
    const item = (await menuList.getItems())[itemIndex];
    await item.click();
  }
}

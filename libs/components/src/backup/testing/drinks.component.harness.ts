import { ComponentHarness, LocatorFnResult } from '@angular/cdk/testing';

export class DrinksComponentHarness extends ComponentHarness {
  static hostSelector = 'lego-components-drinks';

  private get button(): () => Promise<LocatorFnResult<[string]>> {
    return this.locatorFor('button');
  }

  private get listItems(): () => Promise<LocatorFnResult<[string]>[]> {
    return this.locatorForAll('li');
  }

  private get menu(): () => Promise<LocatorFnResult<[string]>> {
    return this.locatorFor('ul');
  }

  async pressKeyOnTrigger(key: string): Promise<void> {
    return (await this.button()).dispatchEvent('keydown', {key})
  }

  async pressKeyOnListItem(key: string, index: number): Promise<void> {
    return (await this.listItems())[index].dispatchEvent('keydown', {key});
  }

  async isListItemFocused(index: number): Promise<boolean> {
    return (await this.listItems())[index].isFocused();
  }

  async isTriggerFocused(): Promise<boolean> {
    return (await this.button()).isFocused();
  }

  async hasMenuAttribute(attribute: string): Promise<string | null> {
    return (await this.menu()).getAttribute(attribute);
  }

  async hasListItemAttribute(attribute: string): Promise<string | null> {
    return (await this.listItems())[0].getAttribute(attribute);
  }
}

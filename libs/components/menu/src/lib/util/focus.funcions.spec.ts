import {
  focusNextItem,
  focusPreviousItem,
  focusFirstItem,
  focusLastItem,
  focusNextItemByCharacter
} from './focus.functions';
import { MenuItem } from './menu.model';

describe('Focus Functions', () => {
  let listItems: HTMLLIElement[];

  const createListItem = (text: string, disabled = false): HTMLLIElement => {
    const el = document.createElement('li');
    el.textContent = text;
    el.tabIndex = -1;
    if (disabled) {
      el.setAttribute('aria-disabled', 'true');
    }

    el.focus = jest.fn();
    return el;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    listItems = [
      createListItem('Apple'),
      createListItem('Banana'),
      createListItem('Cherry'),
      createListItem('Date'),
    ];
  });

  describe('focusNextItem', () => {
    it('should focus next item', () => {
      focusNextItem(1, listItems);
      expect(listItems[2].focus).toHaveBeenCalled();
    });

    it('should skip disabled and wrap around', () => {
      listItems[2].setAttribute('aria-disabled', 'true');
      focusNextItem(1, listItems);
      expect(listItems[3].focus).toHaveBeenCalled();
    });
  });

  describe('focusPreviousItem', () => {
    it('should focus previous item', () => {
      focusPreviousItem(2, listItems);
      expect(listItems[1].focus).toHaveBeenCalled();
    });

    it('should skip disabled and wrap', () => {
      listItems[1].setAttribute('aria-disabled', 'true');
      focusPreviousItem(2, listItems);
      expect(listItems[0].focus).toHaveBeenCalled();
    });
  });

  describe('focusFirstItem', () => {
    it('should focus first enabled item', () => {
      focusFirstItem(listItems);
      expect(listItems[0].focus).toHaveBeenCalled();
    });

    it('should skip disabled items', () => {
      listItems[0].setAttribute('aria-disabled', 'true');
      listItems[1].setAttribute('aria-disabled', 'true');
      focusFirstItem(listItems);
      expect(listItems[2].focus).toHaveBeenCalled();
    });
  });

  describe('focusLastItem', () => {
    it('should focus last enabled item', () => {
      focusLastItem(listItems);
      expect(listItems[3].focus).toHaveBeenCalled();
    });

    it('should skip disabled items in reverse', () => {
      listItems[3].setAttribute('aria-disabled', 'true');
      focusLastItem(listItems);
      expect(listItems[2].focus).toHaveBeenCalled();
    });
  });

  describe('focusNextItemByCharacter', () => {
    let menuItems: MenuItem[];

    beforeEach(() => {
      menuItems = [
        { label: 'Apple', disabled: false },
        { label: 'Banana', disabled: false },
        { label: 'Cherry', disabled: false },
        { label: 'Date', disabled: false },
      ];
    });

    it('should focus the next matching item by char', () => {
      focusNextItemByCharacter('c', 0, listItems as any, menuItems);
      expect(listItems[2].focus).toHaveBeenCalled();
    });

    it('should skip disabled matching items', () => {
      listItems[2].setAttribute('aria-disabled', 'true');
      menuItems[2].disabled = true;
      focusNextItemByCharacter('c', 0, listItems, menuItems);
      expect(listItems[2].focus).not.toHaveBeenCalled();
      expect(listItems[3].focus).not.toHaveBeenCalled();
    });

    it('should do nothing when no match', () => {
      focusNextItemByCharacter(
        'z',
        1,
        listItems,
        menuItems
      );
      listItems.forEach((el) => expect(el.focus).not.toHaveBeenCalled());
    });
  });
});

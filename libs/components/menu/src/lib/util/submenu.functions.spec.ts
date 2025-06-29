import { closeAllSubmenus, isAllClosed } from './submenu.functions';

describe('closeAllSubmenus', (): void => {
  it('should set isOpen to false for all menu items and submenus', () => {
    expect(closeAllSubmenus([
      {
        label: 'Item 1',
        isOpen: true,
        submenu: [
          { label: 'Subitem 1.1', isOpen: true },
          { label: 'Subitem 1.2', isOpen: true, submenu: [{ label: 'Subsubitem 1.2.1', isOpen: true }] }
        ]
      },
      { label: 'Item 2', isOpen: true }
    ])).toEqual([
      {
        label: 'Item 1',
        isOpen: false,
        submenu: [
          { label: 'Subitem 1.1', isOpen: false },
          { label: 'Subitem 1.2', isOpen: false, submenu: [{ label: 'Subsubitem 1.2.1', isOpen: false }] }
        ]
      },
      { label: 'Item 2', isOpen: false }
    ]);
  });
});

describe('isAllClosed', (): void => {
  it('should return true if all menu items and submenus are closed', (): void => {
    expect(isAllClosed([
      {
        label: 'Item 1',
        isOpen: false,
        submenu: [
          { label: 'Subitem 1.1', isOpen: false },
          { label: 'Subitem 1.2', isOpen: false, submenu: [{ label: 'Subsubitem 1.2.1', isOpen: false }] }
        ]
      },
      { label: 'Item 2', isOpen: false }
    ])).toBe(true);
  });
  it('should return false if at least one menu item is open', (): void => {
    expect(isAllClosed([
      {
        label: 'Item 1',
        isOpen: false,
        submenu: [
          { label: 'Subitem 1.1', isOpen: true },
          { label: 'Subitem 1.2', isOpen: false, submenu: [{ label: 'Subsubitem 1.2.1', isOpen: false }] }
        ]
      },
      { label: 'Item 2', isOpen: false }
    ])).toBe(false);
  });
});

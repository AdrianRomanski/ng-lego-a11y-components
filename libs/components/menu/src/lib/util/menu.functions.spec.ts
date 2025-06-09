import { closeAllSubmenus, focusOutside, isAllClosed } from './menu.functions';

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


describe('focusOutside', () => {
  let container: HTMLElement;
  let beforeBtn: HTMLButtonElement;
  let insideBtn1: HTMLButtonElement;
  let insideBtn2: HTMLButtonElement;
  let afterBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="beforeBtn">Before</button>
      <div id="container">
        <button id="insideBtn1">Inside 1</button>
        <button id="insideBtn2">Inside 2</button>
      </div>
      <button id="afterBtn">After</button>
  `;

    beforeBtn = document.getElementById('beforeBtn') as HTMLButtonElement;
    container = document.getElementById('container') as HTMLElement;
    insideBtn1 = document.getElementById('insideBtn1') as HTMLButtonElement;
    insideBtn2 = document.getElementById('insideBtn2') as HTMLButtonElement;
    afterBtn = document.getElementById('afterBtn') as HTMLButtonElement;
  });

  it('should focus next focusable element after container', async () => {
    insideBtn2.focus();
    focusOutside(container, 'next', false);

    expect(document.activeElement).toBe(afterBtn);
  });

  it('should focus previous focusable element before container', () => {
    insideBtn1.focus();
    focusOutside(container, 'previous', false);
    expect(document.activeElement).toBe(beforeBtn);
  });

  it('should do nothing if there is no next element in DOM', () => {
    document.body.removeChild(afterBtn);
    insideBtn2.focus();
    focusOutside(container, 'next', false);
    expect(document.activeElement).toBe(insideBtn2);
  });

  it('should do nothing if there is no previous element in DOM', () => {
    document.body.removeChild(beforeBtn);
    insideBtn1.focus();
    focusOutside(container, 'previous', false);
    expect(document.activeElement).toBe(insideBtn1);
  });
});


import { MenuItem } from '../menu.component';

export function closeAllSubmenus(menu: MenuItem[]): MenuItem[] {
  return menu.map(item => ({
    ...item,
    isOpen: false,
    submenu: item.submenu ? closeAllSubmenus(item.submenu) : undefined,
  }));
}

export function isAllClosed(menuItems: MenuItem[]): boolean {
  for (const item of menuItems) {
    if (item.isOpen === true) {
      return false;
    }
    if (item.submenu && !isAllClosed(item.submenu)) {
      return false;
    }
  }
  return true;
}


export function focusOutside(
  container: HTMLElement,
  direction: 'next' | 'previous',
  filterVisible = true
) {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex="-1"])'
  ];

  const allFocusable = Array.from(
    document.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
  ).filter(el =>
    (!filterVisible || el.offsetParent !== null) &&
    !el.hasAttribute('disabled')
  );

  const currentIndex = allFocusable.findIndex(el => el === document.activeElement);
  if (currentIndex === -1) return;

  const candidates =
    direction === 'next'
      ? allFocusable.slice(currentIndex + 1)
      : allFocusable.slice(0, currentIndex).reverse();

  const nextOutside = candidates.find(el => !container.contains(el));
  nextOutside?.focus();
}

export function isDisabled(el: Element | null): boolean | undefined {
  return el?.classList.contains('disabled');
}

export function focusNextItem(startIndex: number, listItems: HTMLLIElement[]): void {
  let next = (startIndex + 1) % listItems.length;
  while (isDisabled(listItems[next]) && next !== startIndex) {
    next = (next + 1) % listItems.length;
  }
  listItems[next].focus();
}

export function focusPreviousItem(startIndex: number, listItems: HTMLLIElement[]): void {
  let prev = (startIndex - 1 + listItems.length) % listItems.length;
  while (isDisabled(listItems[prev]) && prev !== startIndex) {
    prev = (prev - 1 + listItems.length) % listItems.length;
  }
  listItems[prev].focus();
}

export function focusLastItem(listItems: HTMLLIElement[]): void {
  let last = listItems.length - 1;
  while (last >= 0 && isDisabled(listItems[last])) {
    last--;
  }
  if (last >= 0) listItems[last].focus();
}

export function focusFirstItem(listItems: HTMLLIElement[]): void {
  let first = 0;
  while (first < listItems.length && isDisabled(listItems[first])) {
    first++;
  }
  if (first < listItems.length) listItems[first].focus();
}

export function focusNextItemByCharacter(
    char: string,
    currentIndex: number,
    listItems: NodeListOf<HTMLLIElement>,
    menuItems: MenuItem[]
): void {
  const searchChar = char.toLowerCase();
  const total = listItems.length;

  const matchingIndexes: number[] = [];

  for (let i = 0; i < total; i++) {
    const label = listItems[i].textContent?.trim().toLowerCase() ?? '';
    if (label.startsWith(searchChar)) {
      matchingIndexes.push(i);
    }
  }

  if (matchingIndexes.length === 0) return;

  let start = matchingIndexes.findIndex((i) => i === currentIndex);
  start = start === -1 ? 0 : (start + 1) % matchingIndexes.length;

  for (let i = 0; i < matchingIndexes.length; i++) {
    const candidateIndex =
      matchingIndexes[(start + i) % matchingIndexes.length];
    if (!menuItems[candidateIndex].disabled) {
      listItems[candidateIndex].focus();
      break;
    }
  }
}


export function getTopOffset(count: number): string {
  switch (count) {
    case 0:
    case 1:
      return '80%';
    case 2:
      return '90%';
    case 3:
      return '93%';
    case 4:
      return '95%';
    case 5:
      return '96%';
    default:
      return calculateTopOffset(count);
  }
}

function calculateTopOffset(count: number): string {
  const base = 96;
  const extraItems = count - 5;
  const top = base + extraItems * 0.5;
  return `${top}%`;
}








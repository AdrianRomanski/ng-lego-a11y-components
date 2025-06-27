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

export function getNextEnabledIndex(startIndex: number, listItems: HTMLLIElement[]): number {
  let next = (startIndex + 1) % listItems.length;
  while (isDisabled(listItems[next]) && next !== startIndex) {
    next = (next + 1) % listItems.length;
  }
  return next;
}

export function getPreviousEnabledIndex(startIndex: number, listItems: HTMLLIElement[]): number {
  let prev = (startIndex - 1 + listItems.length) % listItems.length;
  while (isDisabled(listItems[prev]) && prev !== startIndex) {
    prev = (prev - 1 + listItems.length) % listItems.length;
  }
  return prev;
}








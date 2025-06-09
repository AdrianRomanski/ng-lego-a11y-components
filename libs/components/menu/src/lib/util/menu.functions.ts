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

export function focusElementOutside(
  containerToExclude: HTMLElement,
  direction: 'next' | 'previous' = 'next'
): void {
  const focusableSelectors = [
    'a[href]:not([tabindex="-1"]):not([disabled])',
    'button:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    'input:not([type="hidden"]):not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  ];

  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
  ).filter(el =>
    !containerToExclude.contains(el) &&
    (el.offsetParent !== null || getComputedStyle(el).position === 'fixed')
  );

  const current = document.activeElement as HTMLElement;

  const sortedElements = [...focusableElements].sort((a, b) => {
    if (a === b) return 0;
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    return 0;
  });

  const index = sortedElements.findIndex(el => el === current);
  const target =
    direction === 'next'
      ? sortedElements[index + 1] ?? sortedElements[0]
      : sortedElements[index - 1] ?? sortedElements[sortedElements.length - 1];

  if (target) {
    target.focus();
  }
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







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


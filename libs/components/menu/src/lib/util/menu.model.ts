export interface MenuItem {
  label: string;
  isOpen?: boolean;
  disabled?:boolean;
  submenu?: MenuItem[];
}

export interface SelectChange {
  focusFirst?: boolean;
  item?: MenuItem;
  focusIndex?: number;
}

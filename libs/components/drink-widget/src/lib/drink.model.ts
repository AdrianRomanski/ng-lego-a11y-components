export type DrinkSelectionMode = 'default' | 'checkbox' | 'radio';

export interface Drink {
  name: string;
  isHot: boolean;
  isSelected?: boolean;
}

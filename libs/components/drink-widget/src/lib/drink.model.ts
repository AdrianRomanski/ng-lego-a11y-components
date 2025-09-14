export type DrinkSelectionMode = 'span' | 'checkbox' | 'radio';

export interface Drink {
  name: string;
  isHot: boolean;
  isSelected?: boolean;
}

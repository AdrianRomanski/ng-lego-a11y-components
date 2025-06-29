import { MenuItem } from './menu.model';
import { isDisabled } from '@ng-lego/util/functions';

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

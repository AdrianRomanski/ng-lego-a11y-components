# Exercises

## Additional Sources

- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menu_rolen 

## 1. Correct Semantics

Problem: 

- Trigger is just a <span> (not interactive).
- The list container is a <div>.

Task: use correct semantic elements

## 2. Add Appropriate Role

Problem: Screen readers don’t know this is a menu.

Task:

- Add role="menu" to the list container.
- Add aria-haspopup="menu" 
- Add aria-expanded
- Add aria-controls
- Add aria label or aria labeled by

## 3. Focus First Item After Opening

Problem: When the menu opens, focus stays on the trigger. 
Screen reader users don’t know content appeared.

Task:

- Focus first item when opening menu with keyboard

## 4. Keyboard Navigation

Problem: Menu works only with mouse.

Task:

- Add ArrowDown / ArrowUp support to move between drinks.
- Pressing Enter or Space selects the focused drink.
- Pressing Escape closes the menu and returns focus to the trigger.
- Pressing Home focuses first item
- Pressing End focuses last item
- Pressing any character focus first item with this character

Ensure visible focus styles on items.

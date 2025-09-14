# Exercises 

## Additional Sources

- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menuitem_role
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menuitemcheckbox_role
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menuitemradio_role

## 1. Fix Semantics

Problem: The component uses <div> and <input> without proper semantic meaning for a menu/list.

Task: Replace structural elements with appropriate semantic elements.


## 2. Add Appropriate Roles

Problem: Screen readers don’t know if this is a menu, a checkbox, or a radio.

Task:

- Wrap the list in a container with role="menu".

- In checkbox mode: each item should have role="menuitemcheckbox".

- In radio mode: each item should have role="menuitemradio".

- In neutral mode: each item should have role="menuitem".

## 3. Announce Drink Selection

Problem: Visual state (checked/selected) is not announced by screen readers.

Task: Checked and selected state is announced by screen readers

Expected screen reader output:

“Coffee, menu item checkbox, checked”

“Tea, menu item radio, not selected”

## 4 Keyboard Navigation

Problem: Currently selection works only with mouse clicks.

Task: Make the menu navigable with the keyboard.

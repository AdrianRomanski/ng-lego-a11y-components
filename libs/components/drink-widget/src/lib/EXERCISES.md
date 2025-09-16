# Exercises

## Additional Sources
- [Harness Overview](https://angular.dev/guide/testing/component-harnesses-overview)
- [Using Harness](https://angular.dev/guide/testing/using-component-harnesses)
- [Creating Harness](https://angular.dev/guide/testing/creating-component-harnesses)
- [Menu](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menu_role) 

## 1. Correct Semantics
- **Problem**: Trigger is just a <span> (not interactive).
- **Task:** use correct semantic elements

## 2. Add Appropriate Role
- **Problem:** Screen readers don’t know this is a menu.
- **Task:**
  - Add aria-haspopup="menu" 
  - Add aria-expanded
  - Add aria-controls
  - Add aria label or aria labeled by

## 3. Focus First Item After Opening
- **Problem**: When the menu opens, focus stays on the trigger.
- **Task**:
  - Focus First item when opening menu with keyboard
  - Ensure visible focus styles on items.

## 5. Testing
- **Trigger Semantics**
  - Ensure trigger is announced as a button with menu (aria-haspopup="menu").
- **Aria Attributes**
  - Verify aria-expanded and aria-controls update correctly.
- **Focus Management**
  - Ensure focus moves to first item when menu opens and returns to trigger on close.
- **Keyboard Navigation**
  - Ensure that menu can be opened with Enter or Space.

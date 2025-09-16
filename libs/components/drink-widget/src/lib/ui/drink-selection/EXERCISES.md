# Exercises 

## 0. Additional Sources
- [Harness Overview](https://angular.dev/guide/testing/component-harnesses-overview)
- [Using Harness](https://angular.dev/guide/testing/using-component-harnesses)
- [Creating Harness](https://angular.dev/guide/testing/creating-component-harnesses)
- [Menu Item](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menuitem_role]) 
- [Menu Item Checkbox](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menuitemcheckbox_role)
- [Menu Item Radio](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menuitemradio_role)

## 1. Fix Semantics
- **Problem**: The component uses `<div>` and without proper semantic meaning for a menu/list.
- **Task**: Replace structural elements with appropriate semantic elements.

## 2. Add Appropriate Roles
- **Problem**: Screen readers don’t know if this is an item, a checkbox, or a radio.
- **Task**:
  - In checkbox mode: each item should have role="menuitemcheckbox".
  - In radio mode: each item should have role="menuitemradio".
  - In neutral mode: each item should have role="menuitem".

## 3. Add Labels and Checked State
- **Problem**: Checked state is not announced
- **Task**: Add aria-checked (defensive coding, in most cases checked should be enough)

- **Expected screen reader output:**
  - “Coffee, menu item checkbox, checked”
  - “Tea, menu item radio, not selected”

## 4. Component Harness
- **Create component harness**
  - Define a harness class for your component (DrinkSelectionComponent).
  - Extend ComponentHarness.
- **Initialize hostSelector**
  - Set the hostSelector property to match the component’s selector.
- **Create Locators**
  - Add methods to locate and interact with elements inside the component.
- **Load Component Harness**
  - Ensure menu harness initializes correctly.

## 5. Testing
- **Roles Applied Correctly** 
  - Verify menu and menu items expose correct roles (menu, menuitem, menuitemcheckbox, menuitemradio).
- **Selection State**
  - Ensure checked/selected state is exposed to assistive tech (aria-checked).

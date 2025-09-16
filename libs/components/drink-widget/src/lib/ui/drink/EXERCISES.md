# Exercises

## Additional Sources
- [Harness Overview](https://angular.dev/guide/testing/component-harnesses-overview)
- [Using Harness](https://angular.dev/guide/testing/using-component-harnesses)
- [Creating Harness](https://angular.dev/guide/testing/creating-component-harnesses)
- [Aria Label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label)

## 1. Fix Semantics
- **Problem**: <span> has no semantic meaning.
- **Task**: Replace it with a semantic element.

## 2. Hide Icons from Screen Readers
- **Problem**: Icons are announced by screen readers.
- **Task**: Hide the icon from assistive tech so it doesn’t get announced redundantly.

## 3. Announce Hot/Cold
- **Problem**: Right now, “hot” vs “cold” is only shown with CSS.
- **Task**: Add accessible text/attributes/html so screen readers announce whether the drink is hot or cold.

## 4. Component Harness
- **Create component harness** 
  - Define a harness class for your component (DrinkComponent or DrinkWidget).
  - Extend ComponentHarness.
- **Initialize hostSelector**
  - Set the hostSelector property to match the component’s selector.
- **Create Locators** 
  - Add methods to locate and interact with elements inside the component.

## 5. Testing
- **Load Component Harness** 
  - Ensure the component harness initializes correctly.
- **Icons are hidden for screen readers**
  - Ensure decorative icons do not get announced.
- **Hot and Cold is announced for screen readers** 
  - Ensure visual state (hot/cold) is available to assistive tech.

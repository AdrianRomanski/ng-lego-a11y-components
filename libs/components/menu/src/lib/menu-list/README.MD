# Menu List

## ARIA: menuitem role

The menuitem role indicates the element is an option in a set of choices contained by a menu or menubar.

### Description

A menuitem is one of the three types of options in a set of choices contained by a menu
or menubar the other two being menuitemcheckbox and menuitemradio.

The menuitem is only found as a descendant of, or owned by, elements with role menu or menubar,
optionally nested within an element with role group that is contained in, or owned by, a menu.

If the menuitem is not a descendant of a menu in the DOM, include the aria-owns attribute on menu to indicate the relationship.
If aria-owns is set on the menu container to include elements that are not DOM children of the container,
those elements will appear in the reading order in the sequence they are referenced and
after any items that are DOM children in supporting technologies.
Ensure the visual focus order matches the assistive technology reading order.

Every menuitem in a menu is focusable, whether or not it is disabled.
Indicate a menuitem is disabled by setting aria-disabled="true" on the element with the role.

If a menuitem has a submenu, program it to display a new sub-level menu when the menu item is activated
and include aria-haspopup="menu" or with the true value to indicate to assistive technologies that the menu item is used to open a submenu.

A common convention for indicating that a menuitem launches a dialog box is to append "…" (ellipsis) to the menu item label, e.g., "Save as …".

Every menuitem must have an accessible name. This name comes from the element's contents by default.
If the contents don't provide for a useful accessible name, aria-labelledby can be used to reference visible label.
If no visible content is available to provide the accessible name, an accessible name can be provided with aria-label.

### Associated WAI-ARIA roles, states, and properties

- **menu role**
  A widget providing a list of choices. Required context role (or menubar)

- **menubar role**
  A presentation of a menu that usually remains visible and is usually presented horizontally. Required context role (or menu)

- **group role**
  Can be used to identify a set of related menuitems within or otherwise owned by a menu or menubar

- **aria-disabled**
  Indicates the element is perceivable but disabled, so it is not operable

- **aria-haspopup**
  Indicates the availability and type of interactive popup that can be triggered by the menuitem

### Keyboard interactions

- **Enter and Space**
  If the menuitem has a submenu, opens the submenu and places focus on its first item.
  Otherwise, activates the item and closes the menu.

- **Down Arrow**
  On a menuitem that has a submenu in a menubar, opens the submenu and places focus on the first item in the submenu.
  Otherwise, moves focus to the next item, optionally wrapping from the last to the first.

- **Up Arrow**
  - Moves focus to the previous item, optionally wrapping from the first to the last.
  - Optionally, if the menuitem is in a menubar and has a submenu, opens the submenu
    and places focus on the last item in the submenu.

- **Right Arrow**
  - If in a menu opened with a menubutton and not in a menubar, if the menuitem does not have a submenu, does nothing.
  - When focus is in a menubar, moves focus to the next item, optionally wrapping from the last to the first.
  - When focus is in a menu and on a menuitem that has a submenu, opens the submenu and places focus on its first item.
  - When focus is in a menu and on an item that does not have a submenu, closes the submenu and any parent menus,
  - moves focus to the next item in the menubar, and, if focus is now on a menuitem with a submenu, either opens
  - the submenu of that menuitem without moving focus into the submenu, or opens the submenu of
  - that menuitem and places focus on the first item in the submenu.

- **Left Arrow**
  - When focus is in a menubar, moves focus to the previous item, optionally wrapping from the first to the last.
  - When focus is in a submenu of an item in a menu, closes the submenu and returns focus to the parent menuitem.
  - When focus is in a submenu of an item in a menubar, closes the submenu, moves focus to the previous item in the menubar,
  - and, if focus is now on a menuitem with a submenu, either opens the submenu of that menuitem without moving
  - focus into the submenu, or opens the submenu of that menuitem and places focus on the first item in the submenu.

- **Home**
  - If arrow key wrapping is not supported, moves focus to the first item in the current menu or menubar.

- **End**
  - If arrow key wrapping is not supported, moves focus to the last item in the current menu or menubar.

- **Any key that corresponds to a printable character (Optional)**
  - Move focus to the next item in the current menu whose label begins with that printable character.

- **Escape**
  - Close the menu that contains focus and return focus to the element or context,
  - e.g., menu button or parent menuitem, from which the menu was opened.

- **Tab**
  - Moves focus to the next element in the tab sequence, and if the item that had focus is not in a menubar,
  - closes its menu and all open parent menu containers.

- **Shift + Tab**
  - Moves focus to the previous element in the tab sequence, and if the item that had focus is not in a menubar,
  - closes its menu and all open parent menu containers.


- If a menu is opened or a menu bar receives focus as a result of a context action,
Escape or Enter may return focus to the invoking context.

- Some implementations of navigation menubars may have menuitem elements that both perform a function and open a submenu.
In such implementations, Enter and Space perform a navigation function while Down Arrow, in a horizontal menubar,
opens the submenu associated with that same menuitem.

- When items in a menubar are arranged vertically and items in menu containers are arranged horizontally
the Down Arrow performs as Right Arrow is described above, the Up Arrow performs as Left Arrow is described above, and vice versa.

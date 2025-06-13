# Menu 

## ARIA: menu role

The menu role is a type of composite widget that offers a list of choices to the user.

### Description

A menu generally represents a grouping of common actions or functions that the user can
invoke. The menu role is appropriate when a list of menu items is presented in a manner
similar to a menu on a desktop application. Submenus, also known as pop-up menus, also
have the role menu.

While the term "menu" is a generically used term to describe site navigation, the menu
role is for a list of actions or functions that require complex functionality, such as
composite widget focus management and first-character navigation.

A menu can be a permanently visible list of controls or a widget that can be made to open
and close. A closed menu widget is usually opened, or made visible, by activating a menu
button, choosing an item in a menu that opens a submenu, or by invoking a command, such
as Shift + F10 in Windows which opens a context specific menu.

When a user activates a choice in a menu that has been opened, the menu usually closes.
If the menu choice action invokes a submenu, the menu will remain open and the submenu
is displayed.

When a menu opens, keyboard focus is placed on the first menu item. To be keyboard
accessible, you need to manage focus for all descendants: all menu items within the menu
are focusable. The menu button which opens the menu and the menu items, rather than the
menu itself, are the focusable elements.

Menu items include menuitem, menuitemcheckbox, and menuitemradio. Disabled menu items
are focusable but cannot be activated.

Menu items can be grouped in elements with the group role, and separated by elements
with role separator. Neither group nor separator receive focus or are interactive.

If a menu is opened as a result of a context action, Escape or Enter may return focus to
the invoking context. If focus was on the menu button, Enter opens the menu, giving
focus to the first menu item. If focus is on the menu itself, Escape closes the menu and
returns focus to the menu button or parent menubar item (or the context action that
opened the menu).

Elements with the role menu have an implicit aria-orientation value of vertical. For
horizontally oriented menu, use aria-orientation="horizontal".

If the menu is visually persistent, consider the menubar role instead.

### Associated WAI-ARIA roles, states, and properties

- **menuitem, menuitemcheckbox, and menuitemradio roles**  
  Roles of items contained in a containing menu or menubar, known collectively as "menu
  items". These must be able to receive focus.

- **group role**  
  Menu items can be nested in a group.

- **separator role**  
  A divider that separates and distinguishes sections of content or groups of menu items
  within the menu.

- **tabindex attribute**  
  The menu container has tabindex set to -1 or 0 and each item in the menu has tabindex
  set to -1.

- **aria-activedescendant**  
  Set to the ID of the focused item, if there is one.

- **aria-orientation**  
  Indicates whether the menu orientation is horizontal or vertical; defaults to vertical
  if omitted.

- **aria-label or aria-labelledby**  
  The menu is required to have an accessible name. Use aria-labelledby if a visible
  label is present, otherwise use aria-label. Either include the aria-labelledby set to
  the ID of the menuitem or button that controls its display or use aria-label to define
  the label.

- **aria-owns**  
  Only set on the menu container to include elements that are not DOM children of the
  container. If set, those elements will appear in the reading order in the sequence
  they are referenced and after any items that are DOM children. When managing focus,
  ensure the visual focus order matches this assistive technology reading order.

### Keyboard interactions

- **Space / Enter**  
  If the item is a parent menu item, it opens the submenu and moves focus to the first
  item in the submenu. Otherwise, activates the menu item, which loads new content and
  places focus on the heading that titles the content.

- **Escape**  
  When in a submenu, it closes the submenu and moves focus to the parent menu or menubar
  item.

- **Right Arrow**  
  In a menubar, moves focus to the next item in the menubar. If focus is on the last
  item, it moves focus to the first item. If in a submenu, if focus is on an item that
  does not have a submenu, it closes the submenu and moves focus to the next item in the
  menubar. Otherwise, it opens the submenu of the newly focused menubar item, keeping
  focus on that parent menubar item. If not in a menubar or submenu and not on a
  menuitem with a submenu, if focus is not the last focusable element in the menu, it
  optionally moves focus to the next focusable element.

- **Left Arrow**  
  Moves focus to the previous item in the menubar. If focus is on the first item, it
  moves focus to the last item. If in a submenu, it closes the submenu and moves focus
  to the parent menu item. If not in a menubar or submenu, if focus is not the first
  focusable element in the menu, it optionally moves focus to the last focusable
  element.

- **Down Arrow**  
  Opens submenu and moves focus to the first item in the submenu.

- **Up Arrow**  
  Opens submenu and moves focus to the last item in the submenu.

- **Home**  
  Moves focus to the first item in the menubar.

- **End**  
  Moves focus to the last item in the menubar.

- **Any character key**  
  Moves focus to the next item in the menubar having a name that starts with the typed
  character. If none of the items have a name starting with the typed character, focus
  does not move.

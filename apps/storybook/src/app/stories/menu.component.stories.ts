import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { MenuComponent, MenuItem } from '@ng-lego/components/menu';

const meta: Meta<MenuComponent> = {
  component: MenuComponent,
  title: 'MenuComponent',
  decorators: [componentWrapperDecorator((story) => `
        <div
          style="
            width: 70vw;
            height: 60vh;
            margin: 3em;
            padding: 2em;
            border-radius: 8px;
            background-color: #f8f9fa;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
          "
        >
          ${story}
        </div>`)],
  argTypes: {
    menuItems: { control: 'object' },
  },
};
export default meta;
type Story = StoryObj<MenuComponent>;

const menuItems: MenuItem[] = [
  { label: 'Azeroth-1', isOpen: false, disabled: true },
  { label: 'Azeroth', isOpen: false },
  { label: 'Kalimdor', isOpen: false },
  {
    label: 'Dungeons',
    isOpen: false,
    submenu: [
      {
        label: 'Classic',
        isOpen: false,
        submenu: [
          { label: 'Deadmines' },
          { label: 'Shadowfang Keep' },
        ],
      },
      { label: 'Burning Crusade',
        isOpen: false,
        submenu: [
          { label: 'Burning 1' },
          { label: 'Burning 2' },
        ],},
    ],
  },
  { label: 'Battlegrounds', isOpen: false, disabled: true },
  { label: 'Battlegrounds 2', isOpen: false, disabled: false },
  { label: 'Azeroth-2', isOpen: false, disabled: true },
];

export const NestedFactions: Story = {
  args: {
    menuItems
  },
};

export const DeepRaidMenu: Story = {
  args: {
    menuItems: [
      {
        label: 'Raids',
        isOpen: false,
        submenu: [
          {
            label: 'Wrath of the Lich King',
            submenu: [
              {
                label: 'Icecrown Citadel',
                submenu: [
                  { label: 'The Lower Spire' },
                  { label: 'The Frozen Throne' },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
};

export const KeyboardNavigation: Story = {
  args: {
    menuItems: [
      {
        label: 'Raids',
        isOpen: false,
        submenu: [
          {
            label: 'Wrath of the Lich King',
            submenu: [
              {
                label: 'Icecrown Citadel',
                submenu: [
                  { label: 'The Lower Spire' },
                  { label: 'The Frozen Throne' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const menuButton = await canvas.findByRole('button');
    await userEvent.click(menuButton);

    const raidsItem = await canvas.findByText('Raids');
    await userEvent.click(raidsItem);

    await waitFor(() => canvas.getByText('Wrath of the Lich King'));
    const wotlkItem = await canvas.findByText('Wrath of the Lich King');
    await userEvent.click(wotlkItem);

    await waitFor(() => canvas.getByText('Icecrown Citadel'));
    const iccItem = await canvas.findByText('Icecrown Citadel');
    await userEvent.click(iccItem);

    await waitFor(() => canvas.getByText('The Frozen Throne'));
    const frozenThroneItem = await canvas.findByText('The Frozen Throne');
    await userEvent.click(frozenThroneItem);
  }
};

/**
 *
 * User events	Description
 *
 * clear	Selects the text inside inputs, or textareas and deletes it
 * userEvent.clear(await within(canvasElement).getByRole('myinput'));
 *
 * click	Clicks the element, calling a click() function
 * userEvent.click(await within(canvasElement).getByText('mycheckbox'));
 *
 * dblClick	Clicks the element twice
 * userEvent.dblClick(await within(canvasElement).getByText('mycheckbox'));
 *
 * deselectOptions	Removes the selection from a specific option of a select element
 * userEvent.deselectOptions(await within(canvasElement).getByRole('listbox'),'1');
 *
 * hover	Hovers an element
 * userEvent.hover(await within(canvasElement).getByTestId('example-test'));
 *
 * keyboard	Simulates the keyboard events
 * userEvent.keyboard(‘foo’);
 *
 * selectOptions	Selects the specified option, or options of a select element
 * userEvent.selectOptions(await within(canvasElement).getByRole('listbox'),['1','2']);
 *
 * type	Writes text inside inputs, or textareas
 * userEvent.type(await within(canvasElement).getByRole('my-input'),'Some text');
 *
 * unhover	Unhovers out of element
 * userEvent.unhover(await within(canvasElement).getByLabelText(/Example/i));
 */

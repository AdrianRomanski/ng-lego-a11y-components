import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { MenuComponent, MenuItem } from './menu.component';

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
      { label: 'Burning Crusade' },
    ],
  },
  { label: 'Battlegrounds', isOpen: false },
];

export const NestedFactions: Story = {
  args: {
    menuItems
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const menuButton = await canvas.findByRole('button', { name: /menu/i });
    await userEvent.click(menuButton);

    const factionsItem = await canvas.findByText('Dungeons');
    await userEvent.click(factionsItem);

    await waitFor(() => canvas.getByText('Classic'));
    const classicItem = await canvas.findByText('Classic');
    await userEvent.click(classicItem);

    await waitFor(() => canvas.getByText('Deadmines'));
    const deadminesItem = await canvas.findByText('Deadmines');
    await userEvent.click(deadminesItem);
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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const menuButton = await canvas.findByRole('button', { name: /menu/i });
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
  },
};

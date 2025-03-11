import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
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
  /**
   * The second argument to a decorator function is the story context which contains the properties:
   *
   * args - the story arguments. You can use some args in your decorators and drop them in the story implementation itself.
   * argTypes- Storybook's argTypes allow you to customize and fine-tune your stories args.
   * globals - Storybook-wide globals. In particular you can use the toolbars feature to allow you to change these values using Storybook’s UI.
   * hooks - Storybook's API hooks (e.g., useArgs).
   * parameters- the story's static metadata, most commonly used to control Storybook's behavior of features and addons.
   * viewMode- Storybook's current active window (e.g., canvas, docs).
   */
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

export const AzerothMenu: Story = {
  args: { menuItems },
};

export const OnlyOrgrimmar: Story = {
  args: {
    menuItems: [
      { label: 'Orgrimmar', isOpen: false },
    ],
  },
};

export const NestedFactions: Story = {
  args: {
    menuItems: [
      {
        label: 'Factions',
        isOpen: false,
        submenu: [
          {
            label: 'Alliance',
            submenu: [
              { label: 'Stormwind' },
              { label: 'Ironforge' },
            ],
          },
          {
            label: 'Horde',
            submenu: [
              { label: 'Orgrimmar' },
              { label: 'Thunder Bluff' },
            ],
          },
        ],
      },
    ],
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
};


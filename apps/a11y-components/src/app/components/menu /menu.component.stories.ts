import type { Meta, StoryObj } from '@storybook/angular';
import { MenuComponent, MenuItem } from './menu.component';

const meta: Meta<MenuComponent> = {
  component: MenuComponent,
  title: 'MenuComponent',
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


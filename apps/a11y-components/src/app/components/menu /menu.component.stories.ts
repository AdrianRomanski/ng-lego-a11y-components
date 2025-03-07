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
  { label: 'Home', isOpen: false },
  { label: 'About', isOpen: false },
  {
    label: 'Services',
    isOpen: false,
    submenu: [
      {
        label: 'Web Design',
        submenu: [
          { label: 'Black White' },
          { label: 'Color' },
        ],
      },
      { label: 'SEO' },
    ],
  },
  { label: 'Contact', isOpen: false },
];

export const NestedMenu: Story = {
  args: { menuItems },
};

export const OnlyHeading: Story = {
  args: {
    menuItems: [
      { label: 'Only Heading', isOpen: false },
    ],
  },
};

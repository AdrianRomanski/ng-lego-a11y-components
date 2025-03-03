import type { Meta, StoryObj } from '@storybook/angular';
import { MenuComponent } from './menu.component';

const meta: Meta<MenuComponent> = {
  component: MenuComponent,
  title: 'MenuComponent',
};
export default meta;
type Story = StoryObj<MenuComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
};

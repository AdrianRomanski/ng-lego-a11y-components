import type { Meta, StoryObj } from '@storybook/angular';
import { StorybookLibComponent } from './storybook-lib.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<StorybookLibComponent> = {
  component: StorybookLibComponent,
  title: 'StorybookLibComponent',
};
export default meta;
type Story = StoryObj<StorybookLibComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/storybook-lib works!/gi)).toBeTruthy();
  },
};

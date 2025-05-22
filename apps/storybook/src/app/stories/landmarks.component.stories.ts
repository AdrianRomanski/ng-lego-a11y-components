import type { Meta, StoryObj } from '@storybook/angular';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { LandmarksComponent } from '@ng-lego/components/landmarks';

const meta: Meta<LandmarksComponent> = {
  component: LandmarksComponent,
  title: 'LandmarksComponent',
};
export default meta;
type Story = StoryObj<LandmarksComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/landmarks works!/gi)).toBeTruthy();
  },
};

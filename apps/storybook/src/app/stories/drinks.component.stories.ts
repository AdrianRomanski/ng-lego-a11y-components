import { Meta, StoryObj } from '@storybook/angular';
import { DrinkWidget } from '@ng-lego/components/drinks';

const meta: Meta<DrinkWidget> = {
  component: DrinkWidget,
  title: 'DrinkWidget'
}

export default meta;

type Story = StoryObj<DrinkWidget>;

export const BestDrinks: Story = {
  args: {
    drinks: [
      { name: 'Coffee', isHot: true },
      { name: 'Cola', isHot: false },
      { name: 'Beer', isHot: false },
    ]
  }
}

import { Meta, StoryObj } from '@storybook/angular';
import { DrinkWidgetComponent } from '@ng-lego/components/drinks';

const meta: Meta<DrinkWidgetComponent> = {
  component: DrinkWidgetComponent,
  title: 'DrinkWidget'
}

export default meta;

type Story = StoryObj<DrinkWidgetComponent>;

export const BestDrinks: Story = {
  args: {
    drinks: [
      { name: 'Coffee', isHot: true },
      { name: 'Cola', isHot: false },
      { name: 'Beer', isHot: false },
    ]
  }
}

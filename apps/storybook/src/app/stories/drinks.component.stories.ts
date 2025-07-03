import { Meta, StoryObj } from '@storybook/angular';
import { DrinksComponent } from '@ng-lego/components/drinks';

const meta: Meta<DrinksComponent> = {
  component: DrinksComponent,
  title: 'DrinksComponent'
}

export default meta;

type Story = StoryObj<DrinksComponent>;

export const BestDrinks: Story = {
  args: {
    drinks: [
      { name: 'Coffee', isHot: true },
      { name: 'Cola', isHot: false },
      { name: 'Beer', isHot: false },
    ]
  }
}

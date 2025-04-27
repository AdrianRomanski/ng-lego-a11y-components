import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';

const preview: Preview = {
  decorators: [componentWrapperDecorator((story) => `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 90vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
    ">
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 20vw;
        min-height: 20vh;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        max-width: 100%;
      ">
        ${story}
      </div>
    </div>
  `)],
};

export default preview;

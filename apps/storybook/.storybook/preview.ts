import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';

const preview: Preview = {
  decorators: [componentWrapperDecorator((story) => `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 90vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
      gap: 1.5rem;
    ">
      <div style="display: flex; justify-content: center; padding: 1rem">
         <img
            src="https://i.imageupload.app/50cb7f0e724c29589a70.webp"
            alt="image"
            style="
              width: 35%;
              object-fit: fill;
              border-radius: 0.5rem;
              border: 5px solid lightslategray;
            "
          />
      </div>
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 20vw;
        min-height: 20vh;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        border: 5px solid lightslategray;
        max-width: 100%;
      ">
        <div style="color: #FBBC05;">
          ${story}
        </div>
      </div>
    </div>
  `)],
};


export default preview;

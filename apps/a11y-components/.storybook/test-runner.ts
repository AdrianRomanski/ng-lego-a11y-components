import { getStoryContext, TestRunnerConfig } from '@storybook/test-runner';

const shouldRunTests =
  process.env['CI'];

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    if (!shouldRunTests) {
      console.log('Skipping Storybook tests');
      process.exit(0);
    }
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    console.log(`Running test for: ${storyContext.id}`);
  }
};

export default config;

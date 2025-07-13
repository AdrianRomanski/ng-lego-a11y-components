import { focusOutside, isDisabled } from './focus.functions';

describe('isDisabled', () => {
  it('should return true if element has class "disabled"', () => {
    const el = document.createElement('button');
    el.classList.add('disabled');
    expect(isDisabled(el)).toBe(true);
  });

  it('should return true if element has attribute aria-disabled', () => {
    const el = document.createElement('button');
    el.setAttribute('aria-disabled', 'true');
    expect(isDisabled(el)).toBe(true);
  });

  it('should return true if both class "disabled" and aria-disabled are present', () => {
    const el = document.createElement('button');
    el.classList.add('disabled');
    el.setAttribute('aria-disabled', 'true');
    expect(isDisabled(el)).toBe(true);
  });

  it('should return false if element has neither class "disabled" nor aria-disabled', () => {
    const el = document.createElement('button');
    expect(isDisabled(el)).toBe(false);
  });

  it('should return undefined if element is null', () => {
    expect(isDisabled(null)).toBeUndefined();
  });
});

describe('focusOutside', () => {
  let container: HTMLElement;
  let beforeBtn: HTMLButtonElement;
  let insideBtn1: HTMLButtonElement;
  let insideBtn2: HTMLButtonElement;
  let afterBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="beforeBtn">Before</button>
      <div id="container">
        <button id="insideBtn1">Inside 1</button>
        <button id="insideBtn2">Inside 2</button>
      </div>
      <button id="afterBtn">After</button>
  `;

    beforeBtn = document.getElementById('beforeBtn') as HTMLButtonElement;
    container = document.getElementById('container') as HTMLElement;
    insideBtn1 = document.getElementById('insideBtn1') as HTMLButtonElement;
    insideBtn2 = document.getElementById('insideBtn2') as HTMLButtonElement;
    afterBtn = document.getElementById('afterBtn') as HTMLButtonElement;
  });

  it('should focus next focusable element after container', async () => {
    insideBtn2.focus();
    focusOutside(container, 'next', false);

    expect(document.activeElement).toBe(afterBtn);
  });

  it('should focus previous focusable element before container', () => {
    insideBtn1.focus();
    focusOutside(container, 'previous', false);
    expect(document.activeElement).toBe(beforeBtn);
  });

  it('should do nothing if there is no next element in DOM', () => {
    document.body.removeChild(afterBtn);
    insideBtn2.focus();
    focusOutside(container, 'next', false);
    expect(document.activeElement).toBe(insideBtn2);
  });

  it('should do nothing if there is no previous element in DOM', () => {
    document.body.removeChild(beforeBtn);
    insideBtn1.focus();
    focusOutside(container, 'previous', false);
    expect(document.activeElement).toBe(insideBtn1);
  });
});


import { getTopOffset } from './styling.functions';

describe('getTopOffset', () => {
  it.each([
    [0, '80%'],
    [1, '80%'],
    [2, '90%'],
    [3, '93%'],
    [4, '95%'],
    [5, '96%'],
    [6, '96.5%'],
    [7, '97%'],
    [10, '98.5%'],
  ])('should return correct offset for count value', (count, expected) => {
    expect(getTopOffset(count)).toBe(expected);
  });
});

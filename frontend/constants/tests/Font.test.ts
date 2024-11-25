/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => 'MockedFont'),
}));

describe('Font module', () => {
  it('should define the font correctly', () => {
    const FONT = require('../Font').default;
    expect(FONT).toBe('MockedFont');
  });
});

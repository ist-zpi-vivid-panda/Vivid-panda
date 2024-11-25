/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('../Colors', () => ({
  default: {
    light: {
      warning: { main: '#ffBE3C' },
      info: { main: '#bc76ff' },
    },
    dark: {
      warning: { main: '#ffBE3C' },
      info: { main: '#bc76ff' },
    },
  },
}));

describe('Colors module', () => {
  it('should contain the correct warning color for light theme', () => {
    const Colors = require('../Colors').default;
    expect(Colors.light.warning.main).toBe('#ffBE3C');
  });

  it('should contain the correct info color for light theme', () => {
    const Colors = require('../Colors').default;
    expect(Colors.light.info.main).toBe('#bc76ff');
  });
});

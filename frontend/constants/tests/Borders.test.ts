import Borders from '../Borders';

describe('Borders module', () => {
  it('should define small border size', () => {
    expect(Borders.sm).toBe(8);
  });

  it('should define medium border size', () => {
    expect(Borders.md).toBe(12);
  });

  it('should define large border size', () => {
    expect(Borders.lg).toBe(16);
  });
});

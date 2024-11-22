import Colors from './Colors';

describe('Colors module', () => {
  it('should contain the correct danger color', () => {
    expect(Colors.danger).toBe('#B3261E');
  });

  it('should contain the correct warning color', () => {
    expect(Colors.warning).toBe('#ffBE3C');
  });

  it('should contain the correct info color', () => {
    expect(Colors.info).toBe('#bc76ff');
  });
});

import SEO_KEYWORDS from '../SEOKeywords';

describe('SEOKeywords module', () => {
  it('should contain an array of keywords', () => {
    expect(Array.isArray(SEO_KEYWORDS)).toBe(true);
    expect(SEO_KEYWORDS.length).toBeGreaterThan(0);
  });

  it('should include specific keywords', () => {
    expect(SEO_KEYWORDS).toContain('AI photo editor online');
    expect(SEO_KEYWORDS).toContain('AI-powered photo editing app');
    expect(SEO_KEYWORDS).toContain('remove objects from photos AI');
  });
});

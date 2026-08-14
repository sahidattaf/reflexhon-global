import { readFileSync } from 'node:fs';

const studio = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const analytics = readFileSync(new URL('../public/analytics.html', import.meta.url), 'utf8');

describe('Public beta marketing readiness', () => {
  test('labels the Studio as a public beta and discloses limitations', () => {
    expect(studio).toContain('PUBLIC BETA');
    expect(studio).toContain('Reflexhon can make mistakes');
    expect(studio).toContain('Limitations and human correction');
  });

  test('removes unsupported public capability and dataset-count claims', () => {
    expect(studio).not.toContain('Features Active:');
    expect(studio).not.toContain('Explore 70+');
    expect(studio).toContain('Advanced cultural, emotion and memory modules exist');
  });

  test('offers three example prompts and a public feedback route', () => {
    expect((studio.match(/class="prompt-chip"/g) || [])).toHaveLength(3);
    expect(studio).toContain('Give public feedback');
    expect(studio).toContain('/issues/new?title=Beta%20feedback');
  });

  test('links the beta community signup to the published Google Form', () => {
    expect(studio).toContain('id="beta-signup" href="https://forms.gle/G1iYxEPqV2Zpd6447"');
    expect(studio).toContain('Join Beta Community');
    expect(studio).toContain("trackEvent('beta_signup_opened')");
    expect(studio).not.toContain('Signup link pending');
  });

  test('measures event counts without including message text', () => {
    expect(studio).toContain("trackEvent('message_submitted')");
    expect(studio).toContain('function trackEvent(name)');
    expect(studio).not.toContain('function trackEvent(name, payload)');
    expect(studio).toContain("sessionStorage.setItem('reflexhon_beta_events'");
  });

  test('renders chat and dataset values with text or escaping controls', () => {
    expect(studio).toContain('contentDiv.textContent = String(content)');
    expect(studio).toContain('const escapeHtml =');
  });

  test('describes analytics as a non-persistent preview', () => {
    expect(analytics).toContain('Analytics Route Preview');
    expect(analytics).toContain('not persistent or real-time production analytics');
    expect(analytics).not.toContain('Live Analytics Dashboard');
    expect(analytics).not.toContain('300+');
  });
});

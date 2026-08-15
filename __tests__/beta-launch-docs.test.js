import { readFileSync } from 'node:fs';

const FORM_URL = 'https://forms.gle/G1iYxEPqV2Zpd6447';

const launchPlan = readFileSync(new URL('../docs/beta/P2A_LAUNCH_PLAN.md', import.meta.url), 'utf8');
const testerGuide = readFileSync(new URL('../docs/beta/FOUNDING_TESTER_GUIDE.md', import.meta.url), 'utf8');
const triageWorkflow = readFileSync(new URL('../docs/beta/FEEDBACK_TRIAGE_WORKFLOW.md', import.meta.url), 'utf8');
const measurementSpec = readFileSync(new URL('../docs/beta/MEASUREMENT_SPEC.md', import.meta.url), 'utf8');
const weeklyReview = readFileSync(new URL('../docs/beta/WEEKLY_REVIEW_TEMPLATE.md', import.meta.url), 'utf8');
const community = readFileSync(new URL('../COMMUNITY.md', import.meta.url), 'utf8');
const contributing = readFileSync(new URL('../CONTRIBUTING.md', import.meta.url), 'utf8');
const codeOfConduct = readFileSync(new URL('../CODE_OF_CONDUCT.md', import.meta.url), 'utf8');

const publicDocs = {
  'P2A_LAUNCH_PLAN.md': launchPlan,
  'FOUNDING_TESTER_GUIDE.md': testerGuide,
  'FEEDBACK_TRIAGE_WORKFLOW.md': triageWorkflow,
  'MEASUREMENT_SPEC.md': measurementSpec,
  'WEEKLY_REVIEW_TEMPLATE.md': weeklyReview,
  'COMMUNITY.md': community,
  'CONTRIBUTING.md': contributing,
  'CODE_OF_CONDUCT.md': codeOfConduct,
};

const forbiddenTerms = ['ReflexCoin', 'ReflexPoints', 'DAO', 'token', 'wallet', 'payment', 'transferable value'];

// A gated mention must say the thing is excluded, not offered/implemented/promised,
// or requires future legal/governance review — not merely contain "no"/"not" anywhere.
const gatePattern = /\bno\b|\bnot\b|does not|creates no|without any|excluded|requires future legal|governance review/i;

describe('P2A launch pack and community docs — truth-safety and marketing-safety', () => {
  test('defines the program as a 14-day, 25-tester invite-only cohort', () => {
    expect(launchPlan).toContain('25 founding testers');
    expect(launchPlan).toContain('14 days');
    expect(testerGuide).toContain('14-day');
    expect(testerGuide).toContain('25 testers');
  });

  test('links the founding tester signup to the published Google Form', () => {
    expect(testerGuide).toContain(FORM_URL);
    expect(community).toContain(FORM_URL);
  });

  test('states no financial entitlement is created by participation', () => {
    expect(testerGuide).toMatch(/no financial entitlement/i);
    expect(community).toMatch(/no financial entitlement/i);
  });

  test('every ReflexCoin/ReflexPoints/DAO/token/wallet/payment mention is gated, in every public doc', () => {
    for (const [name, doc] of Object.entries(publicDocs)) {
      for (const line of doc.split('\n')) {
        for (const term of forbiddenTerms) {
          if (line.includes(term)) {
            expect({ file: name, line }).toMatchObject({
              line: expect.stringMatching(gatePattern),
            });
          }
        }
      }
    }
  });

  test('no public doc contains accidental shell commands or pasted attachment links', () => {
    for (const [name, doc] of Object.entries(publicDocs)) {
      expect({ file: name, hasShellCommand: /^mv\s+\S+\.md/m.test(doc) }).toMatchObject({ hasShellCommand: false });
      expect({ file: name, hasAttachmentLink: /github\.com\/user-attachments/.test(doc) }).toMatchObject({ hasAttachmentLink: false });
    }
  });

  test('CONTRIBUTING.md covers required sections and links', () => {
    expect(contributing).toMatch(/personal or sensitive information/i);
    expect(contributing).toMatch(/npm test/);
    expect(contributing).toMatch(/npm run lint/);
    expect(contributing).toContain('[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)');
    expect(contributing).toContain('[docs/beta/FEEDBACK_TRIAGE_WORKFLOW.md](docs/beta/FEEDBACK_TRIAGE_WORKFLOW.md)');
    expect(contributing).toMatch(/verified behavior/i);
    expect(contributing).toMatch(/proposed .*capabilit/i);
  });

  test('measurement spec rules out fingerprinting, persistent tracking, and IP storage', () => {
    expect(measurementSpec).toMatch(/no fingerprinting/i);
    expect(measurementSpec).toMatch(/no persistent cross-session tracking/i);
    expect(measurementSpec).toMatch(/no client-ip storage/i);
  });

  test('separates proposed targets from verified results in the launch plan', () => {
    expect(launchPlan).toMatch(/Proposed targets vs\.? verified results/i);
    expect(launchPlan).toMatch(/planning inputs only/i);
  });

  test('replaces the launch-date placeholder with owner-approved dates', () => {
    expect(launchPlan).not.toMatch(/owner-confirmed start date/i);
    expect(launchPlan).toMatch(/owner-approved/i);
    expect(launchPlan).toContain('2026-08-17');
    expect(launchPlan).toContain('2026-08-23');
    expect(launchPlan).toContain('2026-08-30');
    expect(launchPlan).toContain('2026-08-31');
  });
});

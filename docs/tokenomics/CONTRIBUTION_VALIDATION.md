# ✅ ReflexCoin Contribution Validation & Eligibility

This guide explains how to **qualify for ReflexCoin rewards**, the validation process, and what contributions earn tokens.

---

## 🎯 Eligibility Requirements

### Basic Requirements
- ✅ Age 18+ (or parental consent)
- ✅ GitHub account (for code contributions) OR Email (for all contributions)
- ✅ Signed acceptance of [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md)
- ✅ Completed contributor profile:
  ```json
  {
    "github_handle": "@your_handle",
    "email": "you@example.com",
    "role": "Developer|Creator|Educator|DAO Member",
    "languages": ["Papiamentu", "English"],
    "timezone": "Atlantic/Curacao",
    "contribution_type": "code|art|docs|governance"
  }
  ```

### Geographic & Legal
- ✅ No sanctions/restrictions on contributors
- ✅ Contribution is your original work (or properly licensed)
- ✅ No illegal content, weapons, discriminatory material

---

## 📋 Contribution Submission Checklist

Before claiming ReflexCoin, ensure:

### All Contributions
- [ ] Work is complete and functional
- [ ] Metadata sidecar file created (`author.json`, `metadata.json`)
- [ ] Clear description in Papiamentu + English (if possible)
- [ ] License declared (CC-BY-4.0, MIT, Apache-2.0, etc.)
- [ ] No plagiarism or copyright infringement
- [ ] Follows [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md)

### Code Contributions
- [ ] Follows project conventions (see `.github/copilot-instructions.md`)
- [ ] Documented with comments + README
- [ ] Tested locally (if applicable)
- [ ] Submitted as Pull Request with clear description
- [ ] No critical security vulnerabilities

### Art/Design Contributions
- [ ] High-resolution files (SVG preferred for logos, PNG/JPG for rasters)
- [ ] Accessible colors (WCAG AA contrast minimum)
- [ ] Metadata sidecar with author, license, created_at
- [ ] Source file included (e.g., .figma, .psd, .sketch)
- [ ] Proof of ownership (original sketches, design process notes)

### Documentation/Educational Content
- [ ] Clear structure (headings, bullet points, examples)
- [ ] Papiamentu-friendly language (jargon-free, code-switched)
- [ ] Minimum 500 words (for blog posts/tutorials)
- [ ] Factually accurate (citations if needed)
- [ ] Links to related resources
- [ ] Examples or use cases included

### Prompt Submissions (ReflexMarket)
- [ ] Clear, concise prompt text
- [ ] Example output (what the AI should generate)
- [ ] Category tagged (image, text, code, voice, etc.)
- [ ] Culturally respectful (no stereotypes, slurs, discriminatory content)
- [ ] Tested with actual model (include results)
- [ ] License: CC-BY-4.0 or CC0 (public domain)

---

## 🔄 Validation Process

### Step 1: Submission
1. **Create contribution** following the checklist above
2. **Prepare metadata sidecar** (`metadata.json`):
   ```json
   {
     "id": "contribution_001",
     "title": "Your Contribution Title",
     "author": "@your_github_handle",
     "type": "code|art|docs|prompt|governance",
     "created_at": "2025-12-28T10:00:00Z",
     "license": "CC-BY-4.0",
     "description": "What this contribution does...",
     "reflexcoin_claim": 500,
     "language": "Papiamentu|English|Mixed",
     "hours_spent": 20,
     "references": ["url1", "url2"]
   }
   ```
3. **Submit via GitHub Issue or Form**:
   - Title: `📢 ReflexCoin: [Contribution Type] — [Your Title]`
   - Description: Include metadata JSON
   - Attachments: Files, links, examples

### Step 2: Initial Review (24–48 hours)
Our team checks:
- ✅ **Completeness**: All required fields filled
- ✅ **Authenticity**: Is this your original work?
- ✅ **Format**: Does it follow project conventions?

**Possible outcomes**:
- ✅ **Approved for audit** (moves to Step 3)
- 🔄 **Needs revision** (feedback provided, resubmit)
- ❌ **Rejected** (doesn't meet criteria, see rejection reason)

### Step 3: Quality Audit (3–5 days)
Domain expert reviews:

#### For Code
- Functionality (does it work?)
- Security (no vulnerabilities?)
- Maintainability (clear, documented?)
- Test coverage (if applicable)
- Performance (efficient?)

#### For Art/Design
- Aesthetic quality (professional?)
- Accessibility (colors, alt-text, responsiveness?)
- Originality (proof of creation?)
- File quality (resolution, format, source)

#### For Documentation
- Clarity (jargon-free, understandable?)
- Accuracy (factually correct?)
- Completeness (covers the topic?)
- Cultural sensitivity (respectful, inclusive?)
- Usefulness (examples, practical tips?)

#### For Prompts
- Creativity (novel, useful?)
- Quality (generates good outputs?)
- Safety (no harmful content?)
- Originality (not copied from other sources?)

**Audit result**:
- ✅ **Approved** (moves to Step 4)
- 🔄 **Conditional** (minor fixes needed)
- ❌ **Rejected** (major issues, can resubmit after revision)

### Step 4: Ethics Validation (1–2 days)
Ethical review covers:

#### Bias Check
- [ ] No discrimination based on race, gender, age, ability
- [ ] No stereotyping of cultural/ethnic groups
- [ ] Respectful of minority languages & traditions
- [ ] No discriminatory slurs or offensive language

#### Privacy & Consent
- [ ] No personal data (names, emails, IDs) without consent
- [ ] No images/content of people without permission
- [ ] Sources cited and properly attributed

#### Cultural Respect
- [ ] Papiamentu context honored (if applicable)
- [ ] Caribbean cultural awareness demonstrated
- [ ] No appropriation of indigenous knowledge
- [ ] Community values respected

#### Harm Prevention
- [ ] No instructions for illegal/harmful activities
- [ ] No misinformation or false claims
- [ ] No content promoting violence or harassment
- [ ] Contributes to human wellbeing (or neutral)

**Decision**:
- ✅ **Passes ethics audit** → Moves to Step 5
- 🚫 **Fails ethics audit** → Rejected (can appeal with changes)

### Step 5: DAO Vote (if claim > 500 RFX)
Community votes on:
- Contribution quality
- Fair RFX amount
- Alignment with Reflexhon values

**Voting rules**:
- Minimum 24-hour voting window
- Simple majority (50% + 1) required
- 1 vote per active community member
- Tie-break: Project lead decides

**Outcomes**:
- ✅ **Approved** (> 50% YES) → Step 6
- 🔄 **Conditional** (feedback for revision) → Resubmit
- ❌ **Rejected** (> 50% NO) → Cannot claim

### Step 6: Token Distribution
- [ ] Tokens transferred to wallet/account
- [ ] Public record created (anonymized contribution tracker)
- [ ] Contributor notified with transaction details
- [ ] Receipt file generated (proof of distribution)

---

## 💰 Claim Amount Guidelines

### Baseline Rates by Category

#### Code
- **Simple bugfix**: 50–100 RFX
- **Feature (< 10 hours)**: 200–500 RFX
- **Feature (10–40 hours)**: 500–2,000 RFX
- **Major feature (> 40 hours)**: 2,000–5,000 RFX
- **Infrastructure/DevOps**: 1,000–5,000 RFX
- **Documentation**: 100–500 RFX
- **Code review/mentoring**: 25–100 RFX per hour

#### Art & Design
- **Logo/Icon**: 300–1,500 RFX
- **Template/Mockup**: 200–1,000 RFX
- **Illustration**: 150–750 RFX
- **Animation/Video**: 300–2,000 RFX
- **Brand identity**: 1,000–5,000 RFX

#### Prompts & Content
- **Short prompt (< 100 words)**: 25–75 RFX
- **Detailed prompt (100–500 words)**: 75–200 RFX
- **Prompt pack (5+ prompts)**: 200–500 RFX
- **Blog post (500–2,000 words)**: 100–500 RFX
- **Course/series**: 1,000–5,000 RFX

#### Education & Community
- **Workshop (2–4 hours)**: 300–1,000 RFX
- **Tutorial video**: 200–1,000 RFX
- **Translation**: 50–200 RFX per document
- **Moderation/governance**: 200–1,000 RFX/month

### Multipliers
- **Papiamentu-first content**: +10% bonus
- **Highly complex/innovative**: +25% bonus
- **Community-nominated**: +15% boost
- **Accessibility improvements**: +20% bonus

**Example**: 
- Base claim: 500 RFX (good documentation)
- Papiamentu bonus: +50 RFX
- Accessibility focus: +100 RFX
- **Final**: 650 RFX

---

## 📊 Appeal & Dispute Process

### If Your Contribution Is Rejected

1. **Review feedback** from validation team
2. **Address concerns** (make revisions if applicable)
3. **Request appeal** within 14 days of rejection
4. **Provide response** explaining changes or disagreement
5. **Secondary review** by different auditor
6. **Final decision** communicated within 7 days

### Example: Bias Audit Rejection Appeal
```
Original Contribution: Papiamentu AI course
Rejection Reason: Contains outdated cultural references

Appeal Response:
- Reviewed with native Papiamentu speaker
- Updated 5 phrases to modern usage
- Added contextual notes explaining historical references
- Resubmitted with revised version

Outcome: ✅ Approved (700 RFX)
```

---

## 🔍 Transparency & Records

### What You Can See
- ✅ Status of your submissions (pending, approved, rejected)
- ✅ Validation feedback (where applicable)
- ✅ Token balance (if earned)
- ✅ Public contributor leaderboard (anonymized)

### What Stays Private
- ❌ Other contributors' email/personal info
- ❌ Detailed rejection reasons (if sensitive)
- ❌ Specific RFX amounts (unless contributor opts to share)
- ❌ DAO voting patterns (only final vote counts public)

### Public Dashboard (Coming Phase 2)
- Monthly distribution statistics
- Category breakdown (code vs art vs docs)
- Top contributors (by count, not necessarily amount)
- Treasury allocation spend
- Bias audit results

---

## ⚠️ Disqualification

Your contribution may be rejected or tokens forfeited if:

- ❌ Plagiarism detected (copied work without attribution)
- ❌ Harassment or violation of CODE_OF_CONDUCT
- ❌ Misrepresented effort/timeline
- ❌ Undisclosed conflicts of interest
- ❌ Security vulnerability not addressed
- ❌ Discriminatory or harmful content
- ❌ Contributor not in good standing with community

**Appeal process**: Contact [@sahidattaf](https://github.com/sahidattaf) with explanation. Final decision by project lead + DAO vote (if > 50% request review).

---

## 🚀 Getting Started

### Your First Contribution

1. **Choose a role** from [COMMUNITY.md](../../COMMUNITY.md)
   - Developer? Pick a GitHub issue or propose a feature
   - Creator? Design a logo or create a prompt
   - Educator? Write a tutorial or host a workshop
   - DAO member? Help with governance decisions

2. **Prepare your work**
   - Follow the checklist above
   - Create metadata sidecar JSON
   - Test/verify quality before submission

3. **Submit for validation**
   - Open GitHub issue with `📢 ReflexCoin:` prefix
   - Include metadata + links/attachments
   - Wait for initial review (24–48 hours)

4. **Engage with feedback**
   - Address auditor questions promptly
   - Make requested revisions if needed
   - Resubmit if conditional approval

5. **Celebrate!** 🎉
   - Tokens distributed after approval
   - Your work supports the Reflexhon ecosystem
   - You're part of building human-centered AI

---

## 📞 Support & Questions

- **GitHub Issues**: [github.com/sahidattaf/reflexhon-global/issues](https://github.com/sahidattaf/reflexhon-global/issues)
- **Slack**: `#🧠-ai-dev` (community support)
- **Email**: [@sahidattaf](https://github.com/sahidattaf) on GitHub
- **FAQ**: See [docs/FAQ.md](../FAQ.md) (coming soon)

---

**Last updated**: 2025-12-28  
**Version**: 1.0 (Phase 1 Prototype)  
**Questions?** Start an issue or ask in Slack! 🙌

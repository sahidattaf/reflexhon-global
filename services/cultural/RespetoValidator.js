import { logger } from '../../utils/logger.js';

/**
 * Respeto (Respect) Validator
 *
 * In Caribbean culture, RESPETO IS EVERYTHING:
 * - Elders are addressed with special respect
 * - Formal vs informal contexts matter deeply
 * - Indirect communication preserves dignity
 * - Face-saving is crucial (never humiliate)
 * - Tone and word choice convey respect
 *
 * This validator ensures all AI responses maintain
 * appropriate cultural respect levels.
 *
 * Respect Dimensions:
 * 1. Formality (bo vs usted, casual vs formal)
 * 2. Politeness markers (por fabor, danki, perdon)
 * 3. Age-appropriate tone (elders, peers, children)
 * 4. Cultural sensitivity (no offensive terms)
 * 5. Face-saving (indirect critique)
 */
class RespetoValidator {
  constructor() {
    // Respect markers and their weights
    this.respetoMarkers = {
      // Formal address (high respect)
      formal: {
        pronouns: ['usted', 'su'],
        titles: ['señor', 'señora', 'don', 'doña', 'tata', 'mama'],
        phrases: ['ku respeto', 'respetuosamente'],
        weight: 1.0
      },

      // Polite expressions
      polite: {
        words: ['por fabor', 'danki', 'masha danki', 'perdon', 'diskulpa', 'ku permiso'],
        weight: 0.8
      },

      // Informal but respectful (peers, friends)
      informal_respectful: {
        pronouns: ['bo', 'un'],
        phrases: ['asina mes', 'ta bon', 'mi kompañero'],
        weight: 0.5
      },

      // Casual (close relationships)
      casual: {
        pronouns: ['bo', 'mi', 'nos'],
        terms: ['dushi', 'kompai', 'amigo'],
        weight: 0.3
      }
    };

    // Disrespectful patterns to avoid
    this.disrespectPatterns = {
      // Direct commands without softening
      harsh_commands: [
        /^(hasi|kome|bai|para|sali) [^\?]/i, // Do X without please
        /^(no|stop|ketu)/i // Harsh negatives
      ],

      // Offensive/inappropriate terms
      offensive: [
        'loko', // Crazy (can be offensive)
        'tonto', // Dumb
        'estúpido', // Stupid
        'ignorante' // Ignorant (harsh)
      ],

      // Face-threatening acts
      face_threatening: [
        'bo ta ekiboka', // You are wrong (too direct)
        'esei ta fout', // That's wrong
        'bo no sa', // You don't know (condescending)
        'bo mester', // You must (commanding)
        'bo tin ku' // You have to (commanding)
      ],

      // Lack of politeness in requests
      impolite_requests: /^(dal|tuma|hasi|bai|bin) (?!por fabor)/i
    };

    // Respect guidelines by context
    this.contextGuidelines = {
      elder: {
        required_formality: 0.8,
        avoid_casual: true,
        use_titles: true,
        description: 'Elders require high formality and titles'
      },
      peer: {
        required_formality: 0.5,
        avoid_casual: false,
        use_titles: false,
        description: 'Peers allow moderate formality'
      },
      child: {
        required_formality: 0.3,
        avoid_casual: false,
        use_titles: false,
        description: 'Children allow casual but kind tone'
      },
      professional: {
        required_formality: 0.7,
        avoid_casual: true,
        use_titles: true,
        description: 'Professional contexts need formal tone'
      },
      family: {
        required_formality: 0.4,
        avoid_casual: false,
        use_titles: false,
        description: 'Family allows warmth with respect'
      }
    };

    // Polite substitutions
    this.politeSubstitutions = {
      // Commands → Requests
      'hasi esaki': 'por fabor hasi esaki',
      'kome': 'por fabor kome',
      'bai': 'por fabor bai',

      // Direct → Indirect
      'bo ta ekiboka': 'kisa nos por mira esaki di un otro manera',
      'esei ta fout': 'laga nos chèk esei huntu',
      'bo no sa': 'laga mi splika esaki mihó',
      'bo mester': 'lo ta bon si bo por',
      'bo tin ku': 'mi ta sugerí pa bo'
    };
  }

  /**
   * Validate respeto level of text
   *
   * @param {string} text - Text to validate
   * @param {Object} context - Context (age, situation, relationship)
   * @returns {Object} Validation result
   */
  validateRespeto(text, context = {}) {
    const startTime = Date.now();

    logger.info('Validating respeto', {
      text_length: text.length,
      context: context.situation || 'general'
    });

    const lowerText = text.toLowerCase();

    // Calculate respeto score
    const score = this._calculateRespetoScore(lowerText);

    // Check for disrespectful patterns
    const issues = this._detectDisrespect(text);

    // Get guidelines for context
    const guidelines = this._getContextGuidelines(context);

    // Check if respeto meets requirements
    const meetsRequirements = score >= (guidelines.required_formality * 100);

    // Generate suggestions
    const suggestions = this._generateSuggestions(text, score, issues, guidelines);

    // Determine cultural alignment
    const culturalAlignment = this._assessCulturalAlignment(score, issues.length, context);

    const result = {
      text,
      respeto_score: score, // 0-100
      meets_requirements: meetsRequirements,
      required_score: Math.round(guidelines.required_formality * 100),
      issues,
      suggestions,
      cultural_alignment: culturalAlignment,
      context: {
        situation: context.situation || 'general',
        formality_required: guidelines.required_formality,
        guidelines: guidelines.description
      },
      processing_time_ms: Date.now() - startTime
    };

    logger.info('Respeto validation complete', {
      score: result.respeto_score,
      meets_requirements: result.meets_requirements,
      issues_found: result.issues.length
    });

    return result;
  }

  /**
   * Adjust text to increase respeto level
   *
   * @param {string} text - Text to adjust
   * @param {number} targetFormality - Target formality (0-1)
   * @returns {Object} Adjusted text
   */
  adjustForRespeto(text, targetFormality = 0.7) {
    const current = this.validateRespeto(text);
    const currentScore = current.respeto_score / 100;

    if (currentScore >= targetFormality) {
      return {
        original: text,
        adjusted: text,
        changes_made: 0,
        note: 'Text already meets target formality level'
      };
    }

    let adjusted = text;
    const changes = [];

    // Apply polite substitutions
    for (const [direct, polite] of Object.entries(this.politeSubstitutions)) {
      if (adjusted.toLowerCase().includes(direct)) {
        adjusted = adjusted.replace(new RegExp(direct, 'gi'), polite);
        changes.push({
          from: direct,
          to: polite,
          reason: 'Increased politeness'
        });
      }
    }

    // Add por fabor to requests without it
    const requestPattern = /^(dal|tuma|hasi|bai|bin) /i;
    if (requestPattern.test(adjusted) && !adjusted.toLowerCase().includes('por fabor')) {
      adjusted = adjusted.replace(requestPattern, (match) => match + 'por fabor ');
      changes.push({
        from: 'direct request',
        to: 'polite request',
        reason: 'Added "por fabor"'
      });
    }

    // If targeting high formality, suggest using usted
    if (targetFormality > 0.7 && adjusted.toLowerCase().includes(' bo ')) {
      changes.push({
        from: 'bo',
        to: 'usted',
        reason: 'Consider using formal "usted" for higher respect',
        suggestion_only: true // Don't auto-replace pronouns
      });
    }

    return {
      original: text,
      adjusted,
      changes_made: changes.length,
      changes,
      new_respeto_score: this._calculateRespetoScore(adjusted.toLowerCase()),
      target_formality: targetFormality * 100
    };
  }

  /**
   * Detect disrespectful content
   *
   * @param {string} text - Text to check
   * @returns {Array} Issues found
   */
  detectDisrespect(text) {
    return this._detectDisrespect(text);
  }

  /**
   * Get respect guidelines for context
   *
   * @param {string} contextType - Type of context
   * @returns {Object} Guidelines
   */
  getGuidelinesForContext(contextType) {
    return this.contextGuidelines[contextType] || this.contextGuidelines.peer;
  }

  /**
   * Check if text is appropriate for audience
   *
   * @param {string} text - Text to check
   * @param {string} audience - Audience type (elder, peer, child, etc)
   * @returns {Object} Appropriateness assessment
   */
  checkAudienceAppropriate(text, audience = 'peer') {
    const validation = this.validateRespeto(text, { situation: audience });

    return {
      text,
      audience,
      is_appropriate: validation.meets_requirements,
      respeto_score: validation.respeto_score,
      required_score: validation.required_score,
      recommendation: validation.meets_requirements
        ? `Text is appropriate for ${audience}`
        : `Text needs more formality for ${audience}. Current: ${validation.respeto_score}, Required: ${validation.required_score}`,
      suggestions: validation.suggestions
    };
  }

  /**
   * Get respeto statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    const totalMarkers = Object.values(this.respetoMarkers).reduce(
      (sum, category) => {
        return sum + (category.words?.length || 0) +
               (category.phrases?.length || 0) +
               (category.pronouns?.length || 0) +
               (category.titles?.length || 0);
      },
      0
    );

    return {
      respect_markers: totalMarkers,
      contexts_supported: Object.keys(this.contextGuidelines).length,
      disrespect_patterns: Object.values(this.disrespectPatterns).flat().length,
      polite_substitutions: Object.keys(this.politeSubstitutions).length,
      caribbean_calibrated: true
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Calculate respeto score (0-100)
   */
  _calculateRespetoScore(text) {
    let score = 50; // Base score (neutral)

    // Check for formal markers
    for (const marker of this.respetoMarkers.formal.pronouns) {
      if (text.includes(marker)) score += 15;
    }
    for (const marker of this.respetoMarkers.formal.titles) {
      if (text.includes(marker)) score += 12;
    }
    for (const marker of this.respetoMarkers.formal.phrases) {
      if (text.includes(marker)) score += 10;
    }

    // Check for polite markers
    for (const marker of this.respetoMarkers.polite.words) {
      if (text.includes(marker)) score += 8;
    }

    // Check for informal respectful
    for (const marker of this.respetoMarkers.informal_respectful.phrases) {
      if (text.includes(marker)) score += 5;
    }

    // Penalize for offensive terms
    for (const term of this.disrespectPatterns.offensive) {
      if (text.includes(term)) score -= 20;
    }

    // Penalize for face-threatening
    for (const pattern of this.disrespectPatterns.face_threatening) {
      if (text.includes(pattern)) score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Detect disrespectful patterns
   */
  _detectDisrespect(text) {
    const issues = [];
    const lowerText = text.toLowerCase();

    // Check harsh commands
    for (const pattern of this.disrespectPatterns.harsh_commands) {
      if (pattern.test(text)) {
        issues.push({
          type: 'harsh_command',
          severity: 'medium',
          description: 'Command without politeness marker',
          suggestion: 'Add "por fabor" to soften request'
        });
      }
    }

    // Check offensive terms
    for (const term of this.disrespectPatterns.offensive) {
      if (lowerText.includes(term)) {
        issues.push({
          type: 'offensive_term',
          severity: 'high',
          term,
          description: `Term "${term}" can be offensive`,
          suggestion: 'Remove or replace with neutral term'
        });
      }
    }

    // Check face-threatening
    for (const pattern of this.disrespectPatterns.face_threatening) {
      if (lowerText.includes(pattern)) {
        issues.push({
          type: 'face_threatening',
          severity: 'high',
          pattern,
          description: `Phrase "${pattern}" is too direct/threatening`,
          suggestion: 'Use indirect phrasing to save face'
        });
      }
    }

    // Check impolite requests
    if (this.disrespectPatterns.impolite_requests.test(text)) {
      issues.push({
        type: 'impolite_request',
        severity: 'low',
        description: 'Request without "por fabor"',
        suggestion: 'Add "por fabor" for politeness'
      });
    }

    return issues;
  }

  /**
   * Get context guidelines
   */
  _getContextGuidelines(context) {
    const situation = context.situation || context.audience || 'peer';
    return this.contextGuidelines[situation] || this.contextGuidelines.peer;
  }

  /**
   * Generate suggestions for improvement
   */
  _generateSuggestions(text, score, issues, guidelines) {
    const suggestions = [];

    // If score is below required, suggest adding formal markers
    if (score < guidelines.required_formality * 100) {
      suggestions.push({
        type: 'increase_formality',
        current_score: score,
        target_score: Math.round(guidelines.required_formality * 100),
        actions: [
          'Add polite markers like "por fabor", "danki"',
          'Consider using more formal pronouns',
          'Add respectful phrases'
        ]
      });
    }

    // Add specific suggestions from issues
    issues.forEach(issue => {
      suggestions.push({
        type: issue.type,
        severity: issue.severity,
        suggestion: issue.suggestion
      });
    });

    // Context-specific suggestions
    if (guidelines.use_titles && !text.match(/señor|señora|tata|mama/i)) {
      suggestions.push({
        type: 'add_title',
        suggestion: 'Consider adding respectful title (señor, señora, tata, mama)'
      });
    }

    return suggestions;
  }

  /**
   * Assess overall cultural alignment
   */
  _assessCulturalAlignment(score, issueCount, context) {
    let alignment = score / 100;

    // Penalize for issues
    alignment -= issueCount * 0.1;

    // Boost for appropriate context matching
    const guidelines = this._getContextGuidelines(context);
    if (score >= guidelines.required_formality * 100) {
      alignment += 0.1;
    }

    return Math.max(0, Math.min(1, alignment));
  }
}

export default new RespetoValidator();

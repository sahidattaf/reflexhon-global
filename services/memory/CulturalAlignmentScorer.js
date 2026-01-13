/**
 * Cultural Alignment Scorer
 *
 * Comprehensive 10-dimension scoring system for evaluating cultural alignment
 * of AI responses with Papiamentu and Caribbean cultural context.
 *
 * Week 4 - Memory & Learning System
 * Part of Reflexhon Global v3.0.0 - Cultural Intelligence
 */

class CulturalAlignmentScorer {
  constructor() {
    // Dimension weights (must sum to 1.0)
    this.dimensionWeights = {
      language_appropriateness: 0.15,    // Correct language choice and usage
      cultural_sensitivity: 0.15,        // Awareness of cultural nuances
      contextual_relevance: 0.10,        // Response fits the context
      respectfulness: 0.12,              // Respeto - respectful communication
      empathy_level: 0.10,               // Emotional understanding
      warmth_factor: 0.10,               // Caribbean warmth and friendliness
      dialect_accuracy: 0.08,            // Correct dialect usage
      code_switching_quality: 0.08,      // Natural language mixing
      cultural_context_depth: 0.07,      // Cultural explanations and depth
      authenticity: 0.05                 // Overall authenticity
    };

    // Scoring thresholds
    this.qualityThresholds = {
      excellent: 90,
      good: 75,
      acceptable: 60,
      needs_improvement: 40,
      poor: 0
    };

    // Language markers for scoring
    this.languageMarkers = {
      papiamentu: {
        core_words: ['ta', 'ku', 'na', 'pa', 'bo', 'mi', 'nos', 'nan', 'un', 'e'],
        expressions: ['bon dia', 'kon ta bai', 'danki', 'por fabor', 'te oro'],
        verbs: ['kana', 'bai', 'bin', 'hasi', 'kome', 'bebe', 'papia', 'mira', 'siña'],
        authenticity_phrases: [
          'mi ta komponde',
          'nos ta huntu',
          'bo ta bon',
          'e ta importante',
          'danki riba'
        ]
      },
      respect_markers: {
        formal: ['señor', 'señora', 'respetabel', 'honorabel'],
        polite: ['por fabor', 'danki', 'kon permiso'],
        warm: ['mi dushi', 'dushi', 'kurason', 'amor']
      },
      warmth_indicators: {
        high: ['dushi', 'mi dushi', 'amor', 'kurason', 'alegria', 'kontento'],
        medium: ['bon', 'bunita', 'lindura'],
        greeting_warm: ['bon dia', 'bon tardi', 'bon nochi', 'kon ta bai']
      }
    };

    // Cultural context categories
    this.culturalContexts = {
      family: { weight: 1.2, respect_minimum: 0.7 },
      elder: { weight: 1.3, respect_minimum: 0.8 },
      professional: { weight: 1.1, respect_minimum: 0.75 },
      peer: { weight: 1.0, respect_minimum: 0.6 },
      child: { weight: 0.9, respect_minimum: 0.5 },
      community: { weight: 1.15, respect_minimum: 0.7 }
    };

    // Dialect markers
    this.dialectMarkers = {
      aruba: ['aya', 'awendia', 'kontentu'],
      bonaire: ['awor', 'awe', 'ayera'],
      curacao: ['awo', 'awa', 'awor']
    };
  }

  /**
   * Score cultural alignment across all dimensions
   * @param {string} response - AI response to score
   * @param {object} context - Conversation context
   * @returns {Promise<object>} Comprehensive alignment score
   */
  async scoreAlignment(response, context = {}) {
    try {
      // Score each dimension
      const scores = {
        language_appropriateness: this.scoreLanguageAppropriateness(response, context),
        cultural_sensitivity: this.scoreCulturalSensitivity(response, context),
        contextual_relevance: this.scoreContextualRelevance(response, context),
        respectfulness: this.scoreRespectfulness(response, context),
        empathy_level: this.scoreEmpathy(response, context),
        warmth_factor: this.scoreWarmth(response, context),
        dialect_accuracy: this.scoreDialectAccuracy(response, context),
        code_switching_quality: this.scoreCodeSwitching(response, context),
        cultural_context_depth: this.scoreCulturalDepth(response, context),
        authenticity: this.scoreAuthenticity(response, context)
      };

      // Calculate weighted overall score
      const overall = this.calculateOverallScore(scores);

      // Determine quality level
      const quality = this.determineQualityLevel(overall);

      // Generate improvement suggestions
      const suggestions = this.generateSuggestions(scores, context);

      // Create detailed report
      return {
        overall_score: Math.round(overall * 100) / 100,
        quality_level: quality,
        dimension_scores: scores,
        weighted_contributions: this.calculateWeightedContributions(scores),
        suggestions: suggestions,
        context_applied: {
          culture: context.culture || 'caribbean',
          situation: context.situation || 'general',
          audience: context.audience || 'peer'
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error scoring alignment:', error);
      return {
        overall_score: 0,
        error: error.message
      };
    }
  }

  /**
   * Score language appropriateness (Dimension 1)
   * Evaluates if the right language is used correctly
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreLanguageAppropriateness(response, context) {
    let score = 70; // Base score

    const lowerResponse = response.toLowerCase();

    // Check for Papiamentu markers
    const papiamentuCount = this.languageMarkers.papiamentu.core_words.filter(word =>
      new RegExp(`\\b${word}\\b`, 'i').test(response)
    ).length;

    if (papiamentuCount >= 3) {
      score += 15; // Good Papiamentu usage
    } else if (papiamentuCount >= 1) {
      score += 8; // Some Papiamentu
    }

    // Check for expressions
    const expressionCount = this.languageMarkers.papiamentu.expressions.filter(expr =>
      lowerResponse.includes(expr)
    ).length;

    if (expressionCount >= 2) {
      score += 10;
    } else if (expressionCount >= 1) {
      score += 5;
    }

    // Check if language matches context preference
    if (context.language_preference === 'papiamentu' && papiamentuCount >= 2) {
      score += 5; // Bonus for matching preference
    } else if (context.language_preference === 'english' && papiamentuCount === 0) {
      score += 5; // Bonus for matching English preference
    }

    return Math.min(100, score);
  }

  /**
   * Score cultural sensitivity (Dimension 2)
   * Evaluates awareness and respect for cultural nuances
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreCulturalSensitivity(response, context) {
    let score = 75; // Base score (neutral = culturally aware)

    const lowerResponse = response.toLowerCase();

    // Check for cultural awareness indicators
    const culturalIndicators = [
      'cultura',
      'tradishon',
      'komunidat',
      'heritage',
      'island',
      'caribbean',
      'papiamentu'
    ];

    const culturalMentions = culturalIndicators.filter(indicator =>
      lowerResponse.includes(indicator)
    ).length;

    if (culturalMentions >= 2) {
      score += 15;
    } else if (culturalMentions >= 1) {
      score += 8;
    }

    // Penalty for culturally insensitive terms (if any detected)
    const insensitiveTerms = ['primitive', 'backwards', 'simple people'];
    const insensitiveCount = insensitiveTerms.filter(term =>
      lowerResponse.includes(term)
    ).length;

    if (insensitiveCount > 0) {
      score -= 30; // Heavy penalty
    }

    // Bonus for cultural respect phrases
    if (lowerResponse.includes('nos kultura') || lowerResponse.includes('our culture')) {
      score += 5;
    }

    // Context-specific adjustments
    if (context.situation === 'cultural_discussion') {
      // Higher expectations for cultural discussions
      if (culturalMentions === 0) {
        score -= 10;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score contextual relevance (Dimension 3)
   * Evaluates if response fits the conversation context
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreContextualRelevance(response, context) {
    let score = 70; // Base score

    // If we have topic information
    if (context.topic) {
      // Check if response mentions topic-related terms
      const topicWords = context.topic.toLowerCase().split(' ');
      const mentionsCount = topicWords.filter(word =>
        response.toLowerCase().includes(word)
      ).length;

      if (mentionsCount >= topicWords.length * 0.7) {
        score += 20; // Highly relevant
      } else if (mentionsCount >= topicWords.length * 0.4) {
        score += 10; // Somewhat relevant
      }
    }

    // Check response length appropriateness
    const wordCount = response.split(/\s+/).length;
    if (context.expected_length) {
      if (context.expected_length === 'brief' && wordCount <= 50) {
        score += 5;
      } else if (context.expected_length === 'detailed' && wordCount >= 100) {
        score += 5;
      }
    }

    // Check if response answers a question (if context indicates question)
    if (context.is_question) {
      // Look for answer indicators
      const answerIndicators = ['yes', 'no', 'e ta', 'si', 'no ta', 'the answer'];
      const hasAnswer = answerIndicators.some(indicator =>
        response.toLowerCase().includes(indicator)
      );

      if (hasAnswer) {
        score += 10;
      }
    }

    return Math.min(100, score);
  }

  /**
   * Score respectfulness / Respeto (Dimension 4)
   * Evaluates respectful communication appropriate to audience
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreRespectfulness(response, context) {
    let score = 75; // Base score (neutral respect)

    const lowerResponse = response.toLowerCase();

    // Count respect markers
    const formalCount = this.languageMarkers.respect_markers.formal.filter(marker =>
      lowerResponse.includes(marker)
    ).length;

    const politeCount = this.languageMarkers.respect_markers.polite.filter(marker =>
      lowerResponse.includes(marker)
    ).length;

    // Adjust based on audience
    const audience = context.audience || 'peer';
    const culturalContext = this.culturalContexts[audience] || this.culturalContexts.peer;
    const minimumRespect = culturalContext.respect_minimum * 100;

    // Add points for respect markers
    score += (formalCount * 5);
    score += (politeCount * 3);

    // Check for disrespectful terms
    const disrespectfulTerms = ['shut up', 'stupid', 'idiot', 'fool'];
    const disrespectCount = disrespectfulTerms.filter(term =>
      lowerResponse.includes(term)
    ).length;

    if (disrespectCount > 0) {
      score -= 40; // Heavy penalty
    }

    // Ensure minimum respect for audience type
    if (score < minimumRespect) {
      score = minimumRespect * 0.8; // Can't meet minimum, give 80% of required
    }

    // Bonus for elder/family contexts with extra respect
    if ((audience === 'elder' || audience === 'family') && (formalCount + politeCount) >= 2) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score empathy level (Dimension 5)
   * Evaluates emotional understanding and support
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreEmpathy(response, context) {
    let score = 60; // Base score

    const lowerResponse = response.toLowerCase();

    // Empathy indicators
    const empathyPhrases = [
      'mi ta kompronde',        // I understand
      'mi ta sinti',            // I feel
      'e ta normal',            // It's normal
      'bo tin rason',           // You're right
      'mi ta aki pa bo',        // I'm here for you
      'nos ta huntu',           // We're together
      'understand',
      'feel',
      'i hear you',
      'that must be',
      'appreciate'
    ];

    const empathyCount = empathyPhrases.filter(phrase =>
      lowerResponse.includes(phrase)
    ).length;

    // Score based on empathy expressions
    if (empathyCount >= 3) {
      score += 30; // High empathy
    } else if (empathyCount >= 2) {
      score += 20; // Good empathy
    } else if (empathyCount >= 1) {
      score += 10; // Some empathy
    }

    // Check for validation phrases
    const validationPhrases = ['valid', 'makes sense', 'reasonable', 'justified', 'correcto'];
    const hasValidation = validationPhrases.some(phrase =>
      lowerResponse.includes(phrase)
    );

    if (hasValidation) {
      score += 10;
    }

    // Context-based adjustments
    if (context.emotion === 'sad' || context.emotion === 'angry') {
      // Higher expectations for empathy in emotional contexts
      if (empathyCount === 0) {
        score -= 15;
      }
    }

    return Math.min(100, score);
  }

  /**
   * Score warmth factor (Dimension 6)
   * Evaluates Caribbean warmth and friendliness
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreWarmth(response, context) {
    let score = 65; // Base score (Caribbean baseline is warm)

    const lowerResponse = response.toLowerCase();

    // High warmth indicators
    const highWarmth = this.languageMarkers.warmth_indicators.high.filter(indicator =>
      lowerResponse.includes(indicator)
    ).length;

    // Medium warmth indicators
    const mediumWarmth = this.languageMarkers.warmth_indicators.medium.filter(indicator =>
      lowerResponse.includes(indicator)
    ).length;

    // Warm greetings
    const warmGreeting = this.languageMarkers.warmth_indicators.greeting_warm.some(greeting =>
      lowerResponse.includes(greeting)
    );

    // Calculate warmth score
    score += (highWarmth * 10);
    score += (mediumWarmth * 5);
    if (warmGreeting) score += 8;

    // Check for exclamation marks (enthusiasm)
    const exclamations = (response.match(/!/g) || []).length;
    if (exclamations >= 2) {
      score += 5;
    }

    // Penalty for cold/distant language
    const coldPhrases = ['as i mentioned', 'as stated', 'simply put', 'in conclusion'];
    const coldCount = coldPhrases.filter(phrase =>
      lowerResponse.includes(phrase)
    ).length;

    if (coldCount > 0) {
      score -= (coldCount * 5);
    }

    // Context adjustments
    if (context.situation === 'formal') {
      // Formal contexts can be less warm
      score = Math.max(score, 60); // Minimum warmth even in formal
    } else if (context.situation === 'greeting' || context.situation === 'casual') {
      // Greetings and casual contexts should be warmer
      if (score < 70) {
        score = 70;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score dialect accuracy (Dimension 7)
   * Evaluates correct dialect usage when specified
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreDialectAccuracy(response, context) {
    let score = 80; // Base score (neutral, no specific dialect)

    const lowerResponse = response.toLowerCase();

    // If no dialect preference, return base score
    if (!context.dialect_preference || context.dialect_preference === 'auto') {
      return score;
    }

    const preferredDialect = context.dialect_preference.toLowerCase();

    // Check for dialect-specific markers
    if (this.dialectMarkers[preferredDialect]) {
      const dialectWords = this.dialectMarkers[preferredDialect];
      const matchCount = dialectWords.filter(word =>
        lowerResponse.includes(word)
      ).length;

      if (matchCount >= 2) {
        score += 20; // Excellent dialect match
      } else if (matchCount >= 1) {
        score += 10; // Some dialect markers
      }

      // Check for conflicting dialect markers
      Object.keys(this.dialectMarkers).forEach(dialect => {
        if (dialect !== preferredDialect) {
          const conflictWords = this.dialectMarkers[dialect].filter(word =>
            lowerResponse.includes(word)
          ).length;

          if (conflictWords > 0) {
            score -= 10; // Penalty for mixed dialects
          }
        }
      });
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score code-switching quality (Dimension 8)
   * Evaluates natural mixing of languages
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreCodeSwitching(response, context) {
    let score = 75; // Base score

    const lowerResponse = response.toLowerCase();

    // Detect if code-switching is present
    const papiamentuWords = this.languageMarkers.papiamentu.core_words.filter(word =>
      new RegExp(`\\b${word}\\b`, 'i').test(response)
    ).length;

    const hasEnglish = /\b(the|and|is|are|have|with|that)\b/i.test(response);
    const isCodeSwitching = papiamentuWords >= 2 && hasEnglish;

    if (isCodeSwitching) {
      // Code-switching detected - evaluate quality

      // Check if it's natural (not too jarring)
      // Good code-switching keeps phrases intact, not mid-word
      const sentences = response.split(/[.!?]+/);
      let naturalSwitches = 0;
      let awkwardSwitches = 0;

      sentences.forEach(sentence => {
        const words = sentence.trim().split(/\s+/);
        // Count language switches within sentence
        // This is simplified - real implementation would be more sophisticated
        if (words.length > 3) {
          naturalSwitches++; // Assume phrase-level switching is natural
        }
      });

      if (naturalSwitches > awkwardSwitches) {
        score += 15; // Natural code-switching
      } else {
        score -= 10; // Awkward code-switching
      }

    } else if (context.code_switching_expected && !isCodeSwitching) {
      // Expected code-switching but didn't happen
      score -= 15;
    } else if (!context.code_switching_expected && !isCodeSwitching) {
      // No code-switching expected and none present - good!
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score cultural context depth (Dimension 9)
   * Evaluates depth of cultural explanations and context
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreCulturalDepth(response, context) {
    let score = 60; // Base score

    const lowerResponse = response.toLowerCase();

    // Check for cultural explanations
    const explanationIndicators = [
      'because',
      'this is important because',
      'in our culture',
      'traditionally',
      'na nos kultura',
      'segun',
      'debido'
    ];

    const hasExplanation = explanationIndicators.some(indicator =>
      lowerResponse.includes(indicator)
    );

    if (hasExplanation) {
      score += 20;
    }

    // Check for cultural examples
    const exampleIndicators = ['for example', 'pa ehempel', 'like when', 'such as'];
    const hasExample = exampleIndicators.some(indicator =>
      lowerResponse.includes(indicator)
    );

    if (hasExample) {
      score += 15;
    }

    // Check for cultural references
    const culturalRefs = ['famia', 'komunidat', 'isla', 'tradishon', 'respeto', 'folklore'];
    const refCount = culturalRefs.filter(ref =>
      lowerResponse.includes(ref)
    ).length;

    score += (refCount * 5);

    // Context-based expectations
    if (context.requires_cultural_depth && score < 70) {
      // Context requires depth but response lacks it
      score = Math.min(score, 65);
    }

    return Math.min(100, score);
  }

  /**
   * Score overall authenticity (Dimension 10)
   * Evaluates if response feels authentically Caribbean/Papiamentu
   * @param {string} response - Response text
   * @param {object} context - Context
   * @returns {number} Score 0-100
   */
  scoreAuthenticity(response, context) {
    let score = 70; // Base score

    const lowerResponse = response.toLowerCase();

    // Check for authentic Papiamentu phrases
    const authenticCount = this.languageMarkers.papiamentu.authenticity_phrases.filter(phrase =>
      lowerResponse.includes(phrase)
    ).length;

    score += (authenticCount * 10);

    // Check for natural language flow
    // Authentic responses don't feel translated or robotic

    // Penalty for overly formal academic language
    const academicTerms = ['furthermore', 'moreover', 'notwithstanding', 'heretofore'];
    const academicCount = academicTerms.filter(term =>
      lowerResponse.includes(term)
    ).length;

    if (academicCount > 0) {
      score -= (academicCount * 5); // Feels less authentic
    }

    // Bonus for conversational markers
    const conversationalMarkers = ['bien', 'anto', 'esey', 'esta bon', 'okay'];
    const conversationalCount = conversationalMarkers.filter(marker =>
      lowerResponse.includes(marker)
    ).length;

    score += (conversationalCount * 5);

    // Check for Caribbean rhythm (shorter sentences, more direct)
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;

    if (avgSentenceLength < 15) {
      score += 10; // Caribbean style tends to be more direct
    } else if (avgSentenceLength > 25) {
      score -= 5; // Too verbose for typical Caribbean speech
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate weighted overall score
   * @param {object} scores - Individual dimension scores
   * @returns {number} Weighted overall score (0-100)
   */
  calculateOverallScore(scores) {
    let weighted = 0;

    Object.keys(scores).forEach(dimension => {
      const weight = this.dimensionWeights[dimension] || 0;
      const score = scores[dimension] || 0;
      weighted += (score * weight);
    });

    return weighted;
  }

  /**
   * Calculate weighted contributions of each dimension
   * @param {object} scores - Individual dimension scores
   * @returns {object} Weighted contribution per dimension
   */
  calculateWeightedContributions(scores) {
    const contributions = {};

    Object.keys(scores).forEach(dimension => {
      const weight = this.dimensionWeights[dimension] || 0;
      const score = scores[dimension] || 0;
      contributions[dimension] = {
        score: score,
        weight: weight,
        contribution: score * weight,
        percentage: Math.round(weight * 100)
      };
    });

    return contributions;
  }

  /**
   * Determine quality level from overall score
   * @param {number} overallScore - Overall score (0-100)
   * @returns {string} Quality level
   */
  determineQualityLevel(overallScore) {
    if (overallScore >= this.qualityThresholds.excellent) {
      return 'excellent';
    } else if (overallScore >= this.qualityThresholds.good) {
      return 'good';
    } else if (overallScore >= this.qualityThresholds.acceptable) {
      return 'acceptable';
    } else if (overallScore >= this.qualityThresholds.needs_improvement) {
      return 'needs_improvement';
    } else {
      return 'poor';
    }
  }

  /**
   * Generate improvement suggestions based on scores
   * @param {object} scores - Individual dimension scores
   * @param {object} context - Context
   * @returns {array} Array of suggestions
   */
  generateSuggestions(scores, context) {
    const suggestions = [];

    // Language appropriateness
    if (scores.language_appropriateness < 70) {
      suggestions.push({
        dimension: 'language_appropriateness',
        priority: 'high',
        suggestion: 'Increase use of Papiamentu words and expressions to better match language expectations.'
      });
    }

    // Cultural sensitivity
    if (scores.cultural_sensitivity < 70) {
      suggestions.push({
        dimension: 'cultural_sensitivity',
        priority: 'high',
        suggestion: 'Add more cultural awareness and sensitivity to Caribbean/Papiamentu context.'
      });
    }

    // Respectfulness
    if (scores.respectfulness < 70) {
      const audience = context.audience || 'peer';
      suggestions.push({
        dimension: 'respectfulness',
        priority: 'high',
        suggestion: `Increase respectfulness markers appropriate for ${audience} audience. Add "por fabor" or formal terms.`
      });
    }

    // Empathy
    if (scores.empathy_level < 65) {
      suggestions.push({
        dimension: 'empathy_level',
        priority: 'medium',
        suggestion: 'Add more empathetic phrases like "mi ta kompronde" or "mi ta aki pa bo" to show emotional support.'
      });
    }

    // Warmth
    if (scores.warmth_factor < 70) {
      suggestions.push({
        dimension: 'warmth_factor',
        priority: 'medium',
        suggestion: 'Increase warmth with friendly greetings, warm expressions, or terms like "dushi" or "bon".'
      });
    }

    // Cultural depth
    if (scores.cultural_context_depth < 60) {
      suggestions.push({
        dimension: 'cultural_context_depth',
        priority: 'low',
        suggestion: 'Add cultural explanations or examples to provide deeper context.'
      });
    }

    // Authenticity
    if (scores.authenticity < 70) {
      suggestions.push({
        dimension: 'authenticity',
        priority: 'medium',
        suggestion: 'Make language more conversational and natural. Avoid overly formal or academic terms.'
      });
    }

    return suggestions;
  }

  /**
   * Compare alignment scores over time
   * @param {array} scores - Array of historical scores
   * @returns {object} Trend analysis
   */
  analyzeTrends(scores) {
    if (scores.length < 2) {
      return { trend: 'insufficient_data' };
    }

    const recent = scores.slice(-5); // Last 5 scores
    const older = scores.slice(0, -5);

    const recentAvg = recent.reduce((sum, s) => sum + s.overall_score, 0) / recent.length;
    const olderAvg = older.length > 0
      ? older.reduce((sum, s) => sum + s.overall_score, 0) / older.length
      : recentAvg;

    const improvement = recentAvg - olderAvg;

    return {
      trend: improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
      improvement: improvement,
      recent_average: recentAvg,
      historical_average: olderAvg,
      total_scores: scores.length
    };
  }
}

// Export singleton instance
export default new CulturalAlignmentScorer();

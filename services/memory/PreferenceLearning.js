/**
 * Preference Learning Service
 *
 * Learns and adapts to user preferences over time through interaction analysis.
 * Tracks language preferences, communication style, formality, response length, and more.
 *
 * Week 4 - Memory & Learning System
 * Part of Reflexhon Global v3.0.0 - Cultural Intelligence
 */

class PreferenceLearning {
  constructor() {
    // In-memory preference cache
    this.preferenceCache = new Map();

    // Preference categories with default values
    this.preferenceSchema = {
      language: {
        primary: 'papiamentu',      // papiamentu, english, dutch, spanish
        code_switching: true,        // Allow natural language mixing
        translation_style: 'cultural' // cultural, literal, adaptive
      },
      dialect: {
        preferred: 'auto',           // auto, aruba, bonaire, curacao
        respect_variation: true      // Adapt to detected dialect
      },
      communication: {
        formality: 0.5,              // 0 (casual) to 1 (formal)
        warmth: 0.8,                 // 0 (neutral) to 1 (warm) - Caribbean baseline higher
        directness: 0.6,             // 0 (indirect) to 1 (direct)
        empathy_level: 0.9           // 0 (minimal) to 1 (high empathy)
      },
      response: {
        length: 'balanced',          // brief, balanced, detailed, comprehensive
        explanation_depth: 'medium', // simple, medium, technical, expert
        examples: true,              // Include examples in responses
        cultural_context: true       // Include cultural explanations
      },
      interaction: {
        greeting_style: 'warm',      // minimal, friendly, warm, enthusiastic
        closing_style: 'supportive', // brief, supportive, encouraging
        use_emojis: false,           // Use emojis in responses
        local_expressions: true      // Use Papiamentu expressions
      },
      learning: {
        adapt_speed: 'gradual',      // slow, gradual, fast, immediate
        confidence_threshold: 0.7,   // Minimum confidence to apply learned preference
        feedback_weight: 1.5         // How much to weight explicit user feedback
      }
    };

    // Signals that indicate preference changes
    this.preferenceSignals = {
      language: {
        patterns: [
          { phrase: /please.*english/i, preference: { language: { primary: 'english' } } },
          { phrase: /papiamentu|pap/i, preference: { language: { primary: 'papiamentu' } } },
          { phrase: /por fabor.*papiamentu/i, preference: { language: { primary: 'papiamentu' } } },
          { phrase: /in english/i, preference: { language: { primary: 'english' } } }
        ]
      },
      formality: {
        patterns: [
          { phrase: /por fabor|danki|kon|señor|señora/i, adjust: +0.1 },
          { phrase: /ayo|bro|brother|champ|dushi/i, adjust: -0.1 },
          { phrase: /professional|formal|official/i, adjust: +0.2 },
          { phrase: /casual|relax|friendly/i, adjust: -0.2 }
        ]
      },
      length: {
        patterns: [
          { phrase: /keep it short|brief|quick/i, preference: 'brief' },
          { phrase: /more detail|explain|comprehensive/i, preference: 'detailed' },
          { phrase: /tell me everything/i, preference: 'comprehensive' },
          { phrase: /just.*answer/i, preference: 'brief' }
        ]
      },
      explanation: {
        patterns: [
          { phrase: /simple|easy|basic/i, preference: 'simple' },
          { phrase: /technical|advanced|expert/i, preference: 'technical' },
          { phrase: /like.*five.*year/i, preference: 'simple' },
          { phrase: /in.*depth/i, preference: 'expert' }
        ]
      }
    };

    // Interaction patterns to learn from
    this.interactionPatterns = {
      message_length: [],        // Track average user message length
      response_feedback: [],     // Track positive/negative feedback signals
      follow_up_questions: [],   // Track when user asks for clarification
      language_switches: [],     // Track language switching patterns
      time_of_day: [],          // Track interaction times
      topics: []                // Track topic preferences
    };
  }

  /**
   * Learn from a user interaction
   * @param {string} sessionId - Session identifier
   * @param {object} interaction - Interaction data
   * @returns {Promise<object>} Learning results
   */
  async learnFromInteraction(sessionId, interaction) {
    try {
      const {
        user_message,
        ai_response,
        user_feedback = null,
        metadata = {}
      } = interaction;

      // Get current preferences
      const currentPrefs = await this.getPreferences(sessionId);

      // Detect preference signals from user message
      const detectedSignals = this.detectPreferenceSignals(user_message);

      // Analyze message patterns
      const patterns = this.analyzeMessagePatterns(user_message);

      // Detect feedback signals (implicit and explicit)
      const feedback = this.detectFeedback(user_message, user_feedback, metadata);

      // Update preferences based on learning
      const updates = {
        signals: detectedSignals,
        patterns: patterns,
        feedback: feedback,
        confidence: this.calculateConfidence(detectedSignals, patterns, feedback),
        timestamp: new Date().toISOString()
      };

      // Apply updates if confidence threshold met
      if (updates.confidence >= currentPrefs.learning.confidence_threshold) {
        await this.applyLearning(sessionId, currentPrefs, updates);
      }

      // Store learning event
      await this.storeLearningEvent(sessionId, updates);

      return {
        learned: updates.confidence >= currentPrefs.learning.confidence_threshold,
        confidence: updates.confidence,
        updates: updates,
        current_preferences: await this.getPreferences(sessionId)
      };

    } catch (error) {
      console.error('Error learning from interaction:', error);
      return {
        learned: false,
        error: error.message
      };
    }
  }

  /**
   * Detect preference signals from user message
   * @param {string} message - User message
   * @returns {object} Detected signals
   */
  detectPreferenceSignals(message) {
    const signals = {
      language: null,
      formality: 0,
      length: null,
      explanation: null,
      detected: []
    };

    // Check language signals
    for (const pattern of this.preferenceSignals.language.patterns) {
      if (pattern.phrase.test(message)) {
        signals.language = pattern.preference;
        signals.detected.push({ type: 'language', pattern: pattern.phrase.source });
      }
    }

    // Check formality signals
    let formalityAdjust = 0;
    for (const pattern of this.preferenceSignals.formality.patterns) {
      if (pattern.phrase.test(message)) {
        formalityAdjust += pattern.adjust;
        signals.detected.push({ type: 'formality', adjust: pattern.adjust });
      }
    }
    signals.formality = formalityAdjust;

    // Check length preference signals
    for (const pattern of this.preferenceSignals.length.patterns) {
      if (pattern.phrase.test(message)) {
        signals.length = pattern.preference;
        signals.detected.push({ type: 'length', preference: pattern.preference });
      }
    }

    // Check explanation depth signals
    for (const pattern of this.preferenceSignals.explanation.patterns) {
      if (pattern.phrase.test(message)) {
        signals.explanation = pattern.preference;
        signals.detected.push({ type: 'explanation', preference: pattern.preference });
      }
    }

    return signals;
  }

  /**
   * Analyze message patterns
   * @param {string} message - User message
   * @returns {object} Pattern analysis
   */
  analyzeMessagePatterns(message) {
    const patterns = {
      message_length: message.length,
      word_count: message.split(/\s+/).length,
      question_count: (message.match(/\?/g) || []).length,
      exclamation_count: (message.match(/!/g) || []).length,
      politeness_markers: 0,
      warmth_markers: 0,
      language_detected: null
    };

    // Detect politeness markers
    const politenessWords = ['por fabor', 'please', 'danki', 'thank', 'gracias'];
    politenessWords.forEach(word => {
      if (message.toLowerCase().includes(word)) {
        patterns.politeness_markers++;
      }
    });

    // Detect warmth markers
    const warmthWords = ['dushi', 'mi dushi', 'love', 'appreciate', 'grateful'];
    warmthWords.forEach(word => {
      if (message.toLowerCase().includes(word)) {
        patterns.warmth_markers++;
      }
    });

    // Basic language detection
    const papiamentuWords = ['ta', 'ku', 'na', 'pa', 'bo', 'mi', 'nos', 'nan'];
    const papiamentuCount = papiamentuWords.filter(word =>
      new RegExp(`\\b${word}\\b`, 'i').test(message)
    ).length;

    if (papiamentuCount >= 2) {
      patterns.language_detected = 'papiamentu';
    } else {
      patterns.language_detected = 'english';
    }

    return patterns;
  }

  /**
   * Detect feedback signals (implicit and explicit)
   * @param {string} message - Current user message
   * @param {object} explicitFeedback - Explicit feedback if provided
   * @param {object} metadata - Additional metadata
   * @returns {object} Feedback analysis
   */
  detectFeedback(message, explicitFeedback, metadata) {
    const feedback = {
      type: null,           // positive, negative, neutral
      confidence: 0,
      signals: [],
      explicit: explicitFeedback
    };

    // Positive feedback signals
    const positiveSignals = [
      /great|perfect|excellent|good|helpful|thanks|danki|bon/i,
      /exactly|that'?s it|yes.*correct|right/i,
      /love it|appreciate|wonderful/i
    ];

    // Negative feedback signals
    const negativeSignals = [
      /not.*what.*want|wrong|incorrect|no.*that/i,
      /confus|unclear|don'?t understand/i,
      /too.*long|too.*short|too.*complex|too.*simple/i,
      /try again|different/i
    ];

    // Check positive signals
    let positiveCount = 0;
    positiveSignals.forEach(pattern => {
      if (pattern.test(message)) {
        positiveCount++;
        feedback.signals.push({ type: 'positive', pattern: pattern.source });
      }
    });

    // Check negative signals
    let negativeCount = 0;
    negativeSignals.forEach(pattern => {
      if (pattern.test(message)) {
        negativeCount++;
        feedback.signals.push({ type: 'negative', pattern: pattern.source });
      }
    });

    // Determine feedback type and confidence
    if (explicitFeedback) {
      feedback.type = explicitFeedback.type;
      feedback.confidence = 1.0;
    } else if (positiveCount > negativeCount) {
      feedback.type = 'positive';
      feedback.confidence = Math.min(positiveCount * 0.3, 0.9);
    } else if (negativeCount > positiveCount) {
      feedback.type = 'negative';
      feedback.confidence = Math.min(negativeCount * 0.3, 0.9);
    } else {
      feedback.type = 'neutral';
      feedback.confidence = 0.5;
    }

    return feedback;
  }

  /**
   * Calculate confidence score for learning
   * @param {object} signals - Detected signals
   * @param {object} patterns - Message patterns
   * @param {object} feedback - Feedback signals
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(signals, patterns, feedback) {
    let confidence = 0;

    // Signal confidence
    const signalCount = signals.detected.length;
    confidence += Math.min(signalCount * 0.15, 0.4);

    // Pattern consistency confidence
    if (patterns.politeness_markers > 0 || patterns.warmth_markers > 0) {
      confidence += 0.1;
    }

    // Feedback confidence (weighted higher)
    if (feedback.type !== 'neutral') {
      confidence += feedback.confidence * 0.5;
    }

    // Cap at 1.0
    return Math.min(confidence, 1.0);
  }

  /**
   * Apply learning to preferences
   * @param {string} sessionId - Session identifier
   * @param {object} currentPrefs - Current preferences
   * @param {object} updates - Learning updates
   * @returns {Promise<object>} Updated preferences
   */
  async applyLearning(sessionId, currentPrefs, updates) {
    const newPrefs = JSON.parse(JSON.stringify(currentPrefs)); // Deep copy
    const adaptSpeed = newPrefs.learning.adapt_speed;

    // Speed multipliers
    const speedMultiplier = {
      slow: 0.1,
      gradual: 0.3,
      fast: 0.6,
      immediate: 1.0
    };
    const multiplier = speedMultiplier[adaptSpeed] || 0.3;

    // Apply language changes
    if (updates.signals.language) {
      Object.assign(newPrefs.language, updates.signals.language.language);
    }

    // Apply formality adjustment
    if (updates.signals.formality !== 0) {
      const adjustment = updates.signals.formality * multiplier;
      newPrefs.communication.formality = Math.max(0, Math.min(1,
        newPrefs.communication.formality + adjustment
      ));
    }

    // Apply length preference
    if (updates.signals.length) {
      newPrefs.response.length = updates.signals.length;
    }

    // Apply explanation depth
    if (updates.signals.explanation) {
      newPrefs.response.explanation_depth = updates.signals.explanation;
    }

    // Apply feedback-based adjustments
    if (updates.feedback.type === 'negative') {
      // If feedback is negative, adjust empathy and warmth slightly higher
      newPrefs.communication.empathy_level = Math.min(1, newPrefs.communication.empathy_level + 0.05);
      newPrefs.communication.warmth = Math.min(1, newPrefs.communication.warmth + 0.05);
    }

    // Update dialect if detected consistently
    if (updates.patterns.language_detected === 'papiamentu') {
      // Could implement dialect detection here
      // For now, keep auto-detection
    }

    // Save updated preferences
    await this.updatePreferences(sessionId, newPrefs);

    return newPrefs;
  }

  /**
   * Get user preferences for a session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<object>} User preferences
   */
  async getPreferences(sessionId) {
    try {
      // Check cache first
      if (this.preferenceCache.has(sessionId)) {
        return this.preferenceCache.get(sessionId);
      }

      // Try to load from D1 database (if available)
      if (typeof DB !== 'undefined' && DB) {
        const result = await DB.prepare(
          'SELECT preferences FROM user_preferences WHERE session_id = ?'
        ).bind(sessionId).first();

        if (result) {
          const prefs = JSON.parse(result.preferences);
          this.preferenceCache.set(sessionId, prefs);
          return prefs;
        }
      }

      // Return default preferences
      const defaultPrefs = JSON.parse(JSON.stringify(this.preferenceSchema));
      this.preferenceCache.set(sessionId, defaultPrefs);

      return defaultPrefs;

    } catch (error) {
      console.error('Error getting preferences:', error);
      return JSON.parse(JSON.stringify(this.preferenceSchema));
    }
  }

  /**
   * Update preferences for a session
   * @param {string} sessionId - Session identifier
   * @param {object} preferences - New preferences
   * @returns {Promise<boolean>} Success status
   */
  async updatePreferences(sessionId, preferences) {
    try {
      // Update cache
      this.preferenceCache.set(sessionId, preferences);

      // Save to D1 database (if available)
      if (typeof DB !== 'undefined' && DB) {
        await DB.prepare(`
          INSERT INTO user_preferences (session_id, preferences, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(session_id) DO UPDATE SET
            preferences = excluded.preferences,
            updated_at = excluded.updated_at
        `).bind(
          sessionId,
          JSON.stringify(preferences),
          new Date().toISOString()
        ).run();
      }

      return true;

    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Apply preferences to a response
   * @param {string} response - Original response
   * @param {object} preferences - User preferences
   * @returns {object} Adjusted response
   */
  applyPreferences(response, preferences) {
    let adjusted = response;
    const metadata = {
      adjustments: [],
      original_length: response.length
    };

    // Apply length preference
    adjusted = this.adjustResponseLength(adjusted, preferences.response.length, metadata);

    // Apply formality level
    adjusted = this.adjustFormality(adjusted, preferences.communication.formality, metadata);

    // Apply warmth level
    adjusted = this.adjustWarmth(adjusted, preferences.communication.warmth, metadata);

    // Add cultural context if preferred
    if (preferences.response.cultural_context && !adjusted.includes('(Cultural')) {
      // Could add cultural notes here
      metadata.adjustments.push('cultural_context_available');
    }

    // Add examples if preferred
    if (preferences.response.examples && preferences.response.length !== 'brief') {
      metadata.adjustments.push('examples_included');
    }

    return {
      response: adjusted,
      metadata: metadata,
      preferences_applied: preferences
    };
  }

  /**
   * Adjust response length based on preference
   * @param {string} response - Original response
   * @param {string} lengthPref - Length preference
   * @param {object} metadata - Metadata object to update
   * @returns {string} Adjusted response
   */
  adjustResponseLength(response, lengthPref, metadata) {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);

    const targetSentences = {
      brief: 2,
      balanced: 4,
      detailed: 6,
      comprehensive: 10
    };

    const target = targetSentences[lengthPref] || 4;

    if (sentences.length > target && lengthPref !== 'comprehensive') {
      // Trim to target length
      const trimmed = sentences.slice(0, target).join('. ') + '.';
      metadata.adjustments.push(`length_adjusted_to_${lengthPref}`);
      return trimmed;
    }

    return response;
  }

  /**
   * Adjust formality level
   * @param {string} response - Original response
   * @param {number} formalityLevel - Formality level (0-1)
   * @param {object} metadata - Metadata object
   * @returns {string} Adjusted response
   */
  adjustFormality(response, formalityLevel, metadata) {
    let adjusted = response;

    if (formalityLevel > 0.7) {
      // Make more formal
      adjusted = adjusted.replace(/\bayo\b/gi, 'friend');
      adjusted = adjusted.replace(/\bbro\b/gi, 'colleague');
      metadata.adjustments.push('increased_formality');
    } else if (formalityLevel < 0.3) {
      // Make more casual
      // Keep natural casual language
      metadata.adjustments.push('casual_tone_maintained');
    }

    return adjusted;
  }

  /**
   * Adjust warmth level
   * @param {string} response - Original response
   * @param {number} warmthLevel - Warmth level (0-1)
   * @param {object} metadata - Metadata object
   * @returns {string} Adjusted response
   */
  adjustWarmth(response, warmthLevel, metadata) {
    let adjusted = response;

    if (warmthLevel > 0.7 && !response.includes('Mi ta')) {
      // Add warm personal touch
      const warmPhrases = [
        'Mi ta aki pa yuda bo. ',
        'Mi ta kontento pa asisti bo. '
      ];
      // Could prepend warm greeting
      metadata.adjustments.push('warmth_enhanced');
    }

    return adjusted;
  }

  /**
   * Store learning event in database
   * @param {string} sessionId - Session identifier
   * @param {object} learningData - Learning event data
   * @returns {Promise<boolean>} Success status
   */
  async storeLearningEvent(sessionId, learningData) {
    try {
      if (typeof DB !== 'undefined' && DB) {
        await DB.prepare(`
          INSERT INTO learning_events (session_id, event_data, confidence, created_at)
          VALUES (?, ?, ?, ?)
        `).bind(
          sessionId,
          JSON.stringify(learningData),
          learningData.confidence,
          learningData.timestamp
        ).run();
      }
      return true;
    } catch (error) {
      console.error('Error storing learning event:', error);
      return false;
    }
  }

  /**
   * Get preference learning history
   * @param {string} sessionId - Session identifier
   * @param {number} limit - Number of events to retrieve
   * @returns {Promise<object>} Learning history
   */
  async getLearningHistory(sessionId, limit = 20) {
    try {
      if (typeof DB !== 'undefined' && DB) {
        const results = await DB.prepare(`
          SELECT * FROM learning_events
          WHERE session_id = ?
          ORDER BY created_at DESC
          LIMIT ?
        `).bind(sessionId, limit).all();

        return {
          events: results.results.map(row => ({
            ...row,
            event_data: JSON.parse(row.event_data)
          })),
          count: results.results.length
        };
      }

      return { events: [], count: 0 };

    } catch (error) {
      console.error('Error getting learning history:', error);
      return { events: [], count: 0, error: error.message };
    }
  }

  /**
   * Analyze preference patterns over time
   * @param {string} sessionId - Session identifier
   * @returns {Promise<object>} Pattern analysis
   */
  async analyzePatterns(sessionId) {
    try {
      const history = await this.getLearningHistory(sessionId, 50);
      const currentPrefs = await this.getPreferences(sessionId);

      const analysis = {
        total_interactions: history.count,
        learning_events: history.events.length,
        preference_stability: 0,
        dominant_language: null,
        formality_trend: null,
        feedback_ratio: { positive: 0, negative: 0, neutral: 0 },
        confidence_average: 0
      };

      if (history.events.length === 0) {
        return analysis;
      }

      // Calculate average confidence
      const totalConfidence = history.events.reduce((sum, event) => sum + event.confidence, 0);
      analysis.confidence_average = totalConfidence / history.events.length;

      // Analyze feedback ratio
      history.events.forEach(event => {
        if (event.event_data.feedback?.type) {
          analysis.feedback_ratio[event.event_data.feedback.type]++;
        }
      });

      // Determine preference stability (lower is more stable)
      const recentEvents = history.events.slice(0, 10);
      const significantChanges = recentEvents.filter(e => e.confidence > 0.7).length;
      analysis.preference_stability = 1 - (significantChanges / recentEvents.length);

      return analysis;

    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return { error: error.message };
    }
  }

  /**
   * Reset preferences to defaults
   * @param {string} sessionId - Session identifier
   * @returns {Promise<boolean>} Success status
   */
  async resetPreferences(sessionId) {
    try {
      const defaultPrefs = JSON.parse(JSON.stringify(this.preferenceSchema));
      await this.updatePreferences(sessionId, defaultPrefs);
      return true;
    } catch (error) {
      console.error('Error resetting preferences:', error);
      return false;
    }
  }

  /**
   * Get preference summary for a session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<object>} Preference summary
   */
  async getPreferenceSummary(sessionId) {
    try {
      const preferences = await this.getPreferences(sessionId);
      const patterns = await this.analyzePatterns(sessionId);

      return {
        session_id: sessionId,
        language: {
          primary: preferences.language.primary,
          code_switching: preferences.language.code_switching,
          translation_style: preferences.language.translation_style
        },
        communication_style: {
          formality: preferences.communication.formality,
          warmth: preferences.communication.warmth,
          empathy_level: preferences.communication.empathy_level
        },
        response_preferences: {
          length: preferences.response.length,
          explanation_depth: preferences.response.explanation_depth,
          includes_examples: preferences.response.examples
        },
        learning_insights: {
          stability: patterns.preference_stability,
          confidence: patterns.confidence_average,
          total_learning_events: patterns.learning_events
        }
      };

    } catch (error) {
      console.error('Error getting preference summary:', error);
      return { error: error.message };
    }
  }
}

// Export singleton instance
export default new PreferenceLearning();

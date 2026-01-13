import { logger } from '../../utils/logger.js';
import emotionAnalyzer from './EmotionAnalyzer.js';

/**
 * Empathy Engine
 *
 * Generates emotionally intelligent and empathetic responses
 * calibrated for Caribbean cultural norms.
 *
 * True empathy in AI means:
 * 1. Recognizing emotions (what the user feels)
 * 2. Acknowledging feelings (validating their experience)
 * 3. Validating experiences (it's okay to feel that way)
 * 4. Responding appropriately (matching emotional tone)
 *
 * Caribbean Empathy Characteristics:
 * - Warmer, more expressive
 * - Community-oriented ("nos ta aki pa bo")
 * - Family/relational focus
 * - Physical/sensory metaphors
 * - Respectful but intimate
 */
class EmpathyEngine {
  constructor() {
    // Empathetic response templates for each emotion
    this.responseTemplates = {
      // JOY - Celebrate together!
      joy: {
        acknowledge: [
          'Mi ta mira ku bo ta kontentu!',
          'Kon dushi! Mi ta kompronde bo alegria.',
          'E ta bon di mira bo asina felis!'
        ],
        validate: [
          'Bo mereséʼe e felisidat aki.',
          'Ta bon pa selebrá momentonan asina.',
          'Bo tin rason di ta kontentu!'
        ],
        support: [
          'Mi ta kontentu huntu ku bo!',
          'Laga nos selebrá huntu!',
          'Bo alegria ta hasi mi kontentu tambe.'
        ],
        tone: 'celebratory',
        warmth: 0.95
      },

      // SADNESS - Comfort and support
      sadness: {
        acknowledge: [
          'Mi ta kompronde ku bo ta sinti tristesa.',
          'Mi ta mira ku e situashon aki ta doló bo.',
          'Ta difísil ora nos ta sinti asina tristo.'
        ],
        validate: [
          'E ta normal pa sinti tristesa.',
          'Bo tin rason di sinti asina.',
          'Tur hende tin momento difísil.'
        ],
        support: [
          'Mi ta aki pa bo.',
          'No bo ta solu - nos ta huntu.',
          'Konta ku mi pa kua i ora.',
          'Laga nos papia tokante loke ta molestá bo.'
        ],
        tone: 'comforting',
        warmth: 0.90
      },

      // ANGER - Validate but calm
      anger: {
        acknowledge: [
          'Mi ta kompronde ku bo ta molestá.',
          'Bo tin rason di ta sinti korashi.',
          'E situashon aki ta frustrante.'
        ],
        validate: [
          'E ta komprendibel pa bo ta sinti asina.',
          'Bo sentimento ta balioso i importante.',
          'Ta normal pa reakshoná asina.'
        ],
        support: [
          'Laga nos pensa riba e situashon aki huntu.',
          'Mi ta aki pa skicha bo.',
          'Kon nos por yuda resolbé esaki?',
          'Tuma un respira i papia ku mi.'
        ],
        tone: 'calm_validating',
        warmth: 0.75
      },

      // FEAR - Reassure and protect
      fear: {
        acknowledge: [
          'Mi ta kompronde ku bo tin miedo.',
          'E ta normal pa sinti preokupá.',
          'Situashonnan deskonosí por krea nerviosismo.'
        ],
        validate: [
          'E ta balido pa sinti nervioso.',
          'Tur hende tin miedo biaha.',
          'Bo miedo ta real i importante.'
        ],
        support: [
          'Bo no ta solu - mi ta aki.',
          'Nos ta hasí esaki huntu.',
          'Mi lo yuda bo paso pa paso.',
          'Konta ku mi - mi ta protehá bo.'
        ],
        tone: 'reassuring',
        warmth: 0.88
      },

      // LOVE - Reciprocate warmth
      love: {
        acknowledge: [
          'Mi ta sinti bo stima.',
          'Bo amor ta kla i bunita.',
          'Kon dushi e sentimento aki!'
        ],
        validate: [
          'Stima ta un di e kosnan mas bunita.',
          'E ta importante pa spaña amor.',
          'Bo tin un kurason grandi.'
        ],
        support: [
          'Mi ta stima bo tambe.',
          'Nos ta huntu semper.',
          'Bo amor ta hasí diferensia.',
          'Danki pa bo kurason kaluróso.'
        ],
        tone: 'warm_reciprocal',
        warmth: 1.0
      },

      // PRIDE - Celebrate achievements
      pride: {
        acknowledge: [
          'Mi ta mira bo orguyó!',
          'Bo mereséʼe ta sinti orguyoso.',
          'E ta kla ku bo ta satisfecho!'
        ],
        validate: [
          'Bo a traha duru pa esaki.',
          'Bo logro ta importante.',
          'Bo tin rason di ta orguyoso.'
        ],
        support: [
          'Mi ta orguyoso di bo!',
          'Sigui asina - bo ta hasiendo bon!',
          'Bo ta un eshemplo pa otro.',
          'Kontinua briya pa bo meta!'
        ],
        tone: 'proud_encouraging',
        warmth: 0.92
      },

      // NEUTRAL - Gentle engagement
      neutral: {
        acknowledge: [
          'Mi ta aki pa skicha bo.',
          'Kon mi por yuda bo?',
          'Papia ku mi tokante loke bo ke.'
        ],
        validate: [
          'Bo pregunta ta importante.',
          'Mi ta apresiá ku bo ta kompartí ku mi.',
          'E ta bon pa papia tokante esaki.'
        ],
        support: [
          'Mi ta aki pa bo.',
          'Laga nos eksplorá esaki huntu.',
          'Mi ta kla pa yuda.'
        ],
        tone: 'neutral_supportive',
        warmth: 0.70
      }
    };

    // Empathy scoring criteria
    this.empathyCriteria = {
      emotional_recognition: 0.25, // Does it recognize the emotion?
      acknowledgment: 0.25, // Does it acknowledge feelings?
      validation: 0.25, // Does it validate the experience?
      support: 0.25 // Does it offer support?
    };
  }

  /**
   * Generate empathetic response based on detected emotion
   *
   * @param {string} input - User input
   * @param {Object} emotion - Detected emotion (from EmotionAnalyzer)
   * @returns {Object} Empathetic response
   */
  async generateEmpatheticResponse(input, emotion = null) {
    const startTime = Date.now();

    logger.info('Generating empathetic response', {
      input_length: input.length
    });

    // Detect emotion if not provided
    if (!emotion) {
      emotion = emotionAnalyzer.detectEmotion(input);
    }

    const primaryEmotion = emotion.primary || 'neutral';
    const intensity = emotion.intensity || 0.5;

    // Get template for this emotion
    const template = this.responseTemplates[primaryEmotion] || this.responseTemplates.neutral;

    // Build response with three parts: acknowledge + validate + support
    const acknowledge = this._selectRandom(template.acknowledge);
    const validate = this._selectRandom(template.validate);
    const support = this._selectRandom(template.support);

    // Adjust based on intensity
    const shouldIncludeAllParts = intensity > 0.6;

    let response = acknowledge;
    if (shouldIncludeAllParts) {
      response += ' ' + validate;
    }
    response += ' ' + support;

    // Calculate empathy score
    const empathyScore = this._scoreEmpathy(response, emotion);

    const result = {
      input,
      response,
      emotion_detected: {
        primary: primaryEmotion,
        intensity,
        confidence: emotion.confidence
      },
      empathy: {
        score: empathyScore,
        tone: template.tone,
        warmth: template.warmth,
        parts_included: {
          acknowledge: true,
          validate: shouldIncludeAllParts,
          support: true
        }
      },
      cultural_markers: this._extractCulturalMarkers(response),
      processing_time_ms: Date.now() - startTime
    };

    logger.info('Empathetic response generated', {
      emotion: primaryEmotion,
      empathy_score: empathyScore.toFixed(2),
      tone: template.tone
    });

    return result;
  }

  /**
   * Assess empathetic quality of a response
   *
   * @param {string} response - Response to evaluate
   * @param {Object} context - Context (emotion, input, etc)
   * @returns {Object} Empathy assessment
   */
  async assessEmpatheticQuality(response, context = {}) {
    const lowerResponse = response.toLowerCase();

    // Check for emotional recognition words
    const recognitionWords = ['kompronde', 'mira', 'sinti', 'ta kla'];
    const hasRecognition = recognitionWords.some(w => lowerResponse.includes(w));

    // Check for acknowledgment phrases
    const acknowledgmentPhrases = ['mi ta kompronde', 'mi ta mira', 'e ta normal'];
    const hasAcknowledgment = acknowledgmentPhrases.some(p => lowerResponse.includes(p));

    // Check for validation
    const validationWords = ['normal', 'rason', 'balido', 'importante', 'komprendibel'];
    const hasValidation = validationWords.some(w => lowerResponse.includes(w));

    // Check for support
    const supportPhrases = ['mi ta aki', 'nos ta huntu', 'mi lo yuda', 'konta ku mi'];
    const hasSupport = supportPhrases.some(p => lowerResponse.includes(p));

    // Calculate empathy score
    let score = 0;
    if (hasRecognition) score += this.empathyCriteria.emotional_recognition;
    if (hasAcknowledgment) score += this.empathyCriteria.acknowledgment;
    if (hasValidation) score += this.empathyCriteria.validation;
    if (hasSupport) score += this.empathyCriteria.support;

    score = Math.min(score * 100, 100); // Convert to 0-100

    return {
      response,
      empathy_score: score,
      components: {
        emotional_recognition: hasRecognition,
        acknowledgment: hasAcknowledgment,
        validation: hasValidation,
        support: hasSupport
      },
      quality_level: this._getQualityLevel(score),
      suggestions: this._suggestImprovements(score, {
        hasRecognition,
        hasAcknowledgment,
        hasValidation,
        hasSupport
      })
    };
  }

  /**
   * Suggest empathetic improvements for a response
   *
   * @param {string} response - Response to improve
   * @returns {Array} Improvement suggestions
   */
  async suggestEmpatheticImprovements(response) {
    const assessment = await this.assessEmpatheticQuality(response);

    if (assessment.empathy_score >= 90) {
      return {
        response,
        improvements_needed: false,
        current_score: assessment.empathy_score,
        message: 'Response is highly empathetic!'
      };
    }

    const suggestions = assessment.suggestions;

    return {
      response,
      improvements_needed: true,
      current_score: assessment.empathy_score,
      suggestions,
      missing_components: Object.entries(assessment.components)
        .filter(([_, present]) => !present)
        .map(([component]) => component)
    };
  }

  /**
   * Get empathy templates for specific situations
   *
   * @param {string} situation - Situation type
   * @returns {Object} Templates
   */
  getTemplatesForSituation(situation) {
    const situationTemplates = {
      grief: {
        emotion: 'sadness',
        intensity: 'high',
        examples: this.responseTemplates.sadness
      },
      celebration: {
        emotion: 'joy',
        intensity: 'high',
        examples: this.responseTemplates.joy
      },
      frustration: {
        emotion: 'anger',
        intensity: 'medium',
        examples: this.responseTemplates.anger
      },
      confusion: {
        emotion: 'neutral',
        intensity: 'medium',
        examples: this.responseTemplates.neutral
      },
      gratitude: {
        emotion: 'love',
        intensity: 'medium',
        examples: this.responseTemplates.love
      }
    };

    return situationTemplates[situation] || situationTemplates.confusion;
  }

  /**
   * Get empathy statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    const totalTemplates = Object.values(this.responseTemplates).reduce(
      (sum, template) => sum + template.acknowledge.length + template.validate.length + template.support.length,
      0
    );

    return {
      emotions_supported: Object.keys(this.responseTemplates).length,
      total_templates: totalTemplates,
      empathy_criteria: Object.keys(this.empathyCriteria).length,
      caribbean_calibrated: true
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Select random item from array
   */
  _selectRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Score empathy of response
   */
  _scoreEmpathy(response, emotion) {
    const assessment = this.assessEmpatheticQuality(response, { emotion });
    return assessment.empathy_score / 100; // Return as 0-1
  }

  /**
   * Extract cultural markers from response
   */
  _extractCulturalMarkers(response) {
    const culturalWords = ['huntu', 'nos', 'famia', 'kurason', 'stima', 'respeto', 'komunidad'];
    const markers = [];

    const lowerResponse = response.toLowerCase();
    culturalWords.forEach(word => {
      if (lowerResponse.includes(word)) {
        markers.push(word);
      }
    });

    return markers;
  }

  /**
   * Get quality level from score
   */
  _getQualityLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'adequate';
    if (score >= 40) return 'needs_improvement';
    return 'poor';
  }

  /**
   * Suggest improvements based on missing components
   */
  _suggestImprovements(score, components) {
    const suggestions = [];

    if (!components.hasRecognition) {
      suggestions.push({
        component: 'emotional_recognition',
        suggestion: 'Add phrase recognizing the emotion: "Mi ta kompronde ku..." or "Mi ta mira ku..."',
        example: 'Mi ta kompronde ku bo ta sinti tristo.'
      });
    }

    if (!components.hasAcknowledgment) {
      suggestions.push({
        component: 'acknowledgment',
        suggestion: 'Acknowledge the feeling explicitly',
        example: 'E ta difísil ora nos ta sinti asina.'
      });
    }

    if (!components.hasValidation) {
      suggestions.push({
        component: 'validation',
        suggestion: 'Validate that the emotion is normal and okay',
        example: 'E ta normal pa sinti asina.'
      });
    }

    if (!components.hasSupport) {
      suggestions.push({
        component: 'support',
        suggestion: 'Offer support or help',
        example: 'Mi ta aki pa bo. / Nos ta huntu.'
      });
    }

    return suggestions;
  }
}

export default new EmpathyEngine();

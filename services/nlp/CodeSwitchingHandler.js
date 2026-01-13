import { logger } from '../../utils/logger.js';
import papiamentuNLP from './PapiamentuNLP.js';

/**
 * Code-Switching Handler
 *
 * Handles natural language mixing that's common in Caribbean speech:
 * - Papiamentu + English: "Mi ta feeling bon today!"
 * - Papiamentu + Dutch: "Nos ta gaande naar e beach"
 * - Papiamentu + Spanish: "E ta muy importante pa nos"
 * - Multi-language mixing: "Mi friend ta muy busy hasi trabou"
 *
 * This is CRITICAL for Caribbean authenticity because:
 * 1. Caribbean speakers naturally mix languages
 * 2. It's not "wrong" - it's culturally authentic
 * 3. Our AI should understand and preserve this mixing
 *
 * Features:
 * - Detect where languages switch
 * - Identify language of each segment
 * - Normalize to single language (if needed)
 * - Preserve natural switching (for authentic responses)
 * - Score authenticity of code-switching
 */
class CodeSwitchingHandler {
  constructor() {
    // Language markers for quick detection
    this.languageMarkers = {
      papiamentu: {
        markers: ['ta', 'tabata', 'kiko', 'kon', 'mi', 'bo', 'nos', 'e', 'nan', 'hopi', 'masha'],
        weight: 2.0
      },
      english: {
        markers: ['the', 'is', 'are', 'was', 'were', 'am', 'have', 'has', 'what', 'how', 'today', 'tomorrow', 'very', 'feeling', 'busy'],
        weight: 1.0
      },
      dutch: {
        markers: ['het', 'een', 'de', 'naar', 'van', 'is', 'zijn', 'gaande', 'op', 'aan'],
        weight: 1.0
      },
      spanish: {
        markers: ['el', 'la', 'es', 'está', 'muy', 'para', 'con', 'qué', 'cómo'],
        weight: 1.0
      }
    };

    // Common code-switching patterns in Caribbean speech
    this.commonPatterns = [
      {
        pattern: /mi ta (feeling|thinking|doing)/i,
        languages: ['papiamentu', 'english'],
        authenticity: 0.9,
        example: 'Mi ta feeling bon'
      },
      {
        pattern: /nos ta (going|coming|busy)/i,
        languages: ['papiamentu', 'english'],
        authenticity: 0.9,
        example: 'Nos ta going beach'
      },
      {
        pattern: /e ta muy/i,
        languages: ['papiamentu', 'spanish'],
        authenticity: 0.8,
        example: 'E ta muy importante'
      },
      {
        pattern: /ta (bon|importante|dushi) (today|tomorrow)/i,
        languages: ['papiamentu', 'english'],
        authenticity: 0.85,
        example: 'Ta bon today'
      },
      {
        pattern: /mi (friend|family|trabajo)/i,
        languages: ['papiamentu', 'english', 'spanish'],
        authenticity: 0.7,
        example: 'Mi friend ta aki'
      }
    ];

    // Typical switch points (where language changes often occur)
    this.switchPoints = {
      verbs: ['feeling', 'thinking', 'doing', 'going', 'coming'],
      adjectives: ['busy', 'happy', 'sad', 'tired'],
      time: ['today', 'tomorrow', 'yesterday', 'now'],
      places: ['beach', 'casa', 'school', 'werk'],
      intensity: ['muy', 'very', 'heel', 'masha']
    };
  }

  /**
   * Detect code-switching in text
   * Returns array of segments with their languages
   *
   * @param {string} text - Input text
   * @returns {Object} Code-switching analysis
   */
  detectSwitching(text) {
    const startTime = Date.now();

    logger.info('Detecting code-switching', { text });

    const words = text.split(/\s+/);
    const segments = [];
    let currentSegment = {
      text: [],
      language: null,
      start: 0,
      end: 0
    };

    // Analyze each word
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const detectedLang = this._detectWordLanguage(word);

      if (detectedLang !== currentSegment.language && currentSegment.text.length > 0) {
        // Language switch detected! Close current segment
        currentSegment.end = i - 1;
        currentSegment.text = currentSegment.text.join(' ');
        segments.push({ ...currentSegment });

        // Start new segment
        currentSegment = {
          text: [word],
          language: detectedLang,
          start: i,
          end: i
        };
      } else {
        // Continue current segment
        currentSegment.text.push(word);
        currentSegment.end = i;
        if (!currentSegment.language) {
          currentSegment.language = detectedLang;
        }
      }
    }

    // Add final segment
    if (currentSegment.text.length > 0) {
      currentSegment.text = Array.isArray(currentSegment.text)
        ? currentSegment.text.join(' ')
        : currentSegment.text;
      segments.push(currentSegment);
    }

    // Analyze switching patterns
    const switchCount = segments.length - 1;
    const languages = [...new Set(segments.map(s => s.language))];
    const isMixed = languages.length > 1;

    // Check if switching matches common patterns
    const matchedPatterns = this._matchCodeSwitchingPatterns(text);
    const authenticityScore = this._scoreAuthenticity(segments, matchedPatterns);

    const result = {
      text,
      is_code_switched: isMixed,
      switch_count: switchCount,
      languages_detected: languages,
      segments,
      matched_patterns: matchedPatterns,
      authenticity_score: authenticityScore,
      is_natural: authenticityScore > 0.7,
      processing_time_ms: Date.now() - startTime
    };

    logger.info('Code-switching analysis complete', {
      is_mixed: isMixed,
      languages: languages.length,
      authenticity: authenticityScore.toFixed(2)
    });

    return result;
  }

  /**
   * Normalize code-switched text to single language
   *
   * @param {string} text - Mixed language text
   * @param {string} targetLanguage - Target language
   * @returns {Object} Normalized text
   */
  async normalizeText(text, targetLanguage = 'papiamentu') {
    logger.info('Normalizing code-switched text', { targetLanguage });

    const analysis = this.detectSwitching(text);

    if (!analysis.is_code_switched) {
      return {
        original: text,
        normalized: text,
        changes_made: 0,
        note: 'Text is already in single language'
      };
    }

    // Convert each segment to target language
    const normalizedSegments = [];
    for (const segment of analysis.segments) {
      if (segment.language === targetLanguage) {
        // Already in target language
        normalizedSegments.push(segment.text);
      } else {
        // Would need translation service here
        // For now, keep original (would integrate with TranslationService)
        normalizedSegments.push(segment.text);
      }
    }

    const normalized = normalizedSegments.join(' ');

    return {
      original: text,
      normalized,
      source_languages: analysis.languages_detected,
      target_language: targetLanguage,
      segments_normalized: analysis.segments.length,
      changes_made: text !== normalized ? 1 : 0
    };
  }

  /**
   * Preserve natural code-switching
   * Returns text with authentic language mixing
   *
   * @param {string} text - Input text
   * @returns {Object} Analysis with preservation recommendation
   */
  preserveSwitching(text) {
    logger.info('Analyzing code-switching preservation');

    const analysis = this.detectSwitching(text);

    // Determine if code-switching should be preserved
    const shouldPreserve = analysis.is_code_switched &&
                          analysis.is_natural &&
                          analysis.authenticity_score > 0.7;

    return {
      text,
      should_preserve: shouldPreserve,
      authenticity_score: analysis.authenticity_score,
      is_natural: analysis.is_natural,
      recommendation: shouldPreserve
        ? 'Preserve code-switching - it\'s authentic Caribbean speech'
        : 'Consider normalizing - switching pattern is unusual',
      segments: analysis.segments,
      matched_patterns: analysis.matched_patterns
    };
  }

  /**
   * Generate natural code-switched response
   * Creates authentic mixed-language text
   *
   * @param {string} baseText - Base text in primary language
   * @param {string} primaryLanguage - Primary language
   * @param {Array} allowedLanguages - Languages allowed for mixing
   * @returns {string} Code-switched text
   */
  generateCodeSwitchedText(baseText, primaryLanguage = 'papiamentu', allowedLanguages = ['english']) {
    logger.info('Generating natural code-switched text');

    // For now, return base text
    // In full implementation, would strategically insert words from allowed languages
    // at natural switch points (verbs, adjectives, etc.)

    // Example: "Mi ta bon" → "Mi ta feeling bon" (Papiamentu + English)

    return baseText;
  }

  /**
   * Validate code-switching appropriateness
   * Checks if code-switching is appropriate for context
   *
   * @param {string} text - Code-switched text
   * @param {Object} context - Context (formal, casual, educational, etc)
   * @returns {Object} Validation result
   */
  validateCodeSwitching(text, context = {}) {
    const analysis = this.detectSwitching(text);

    // Code-switching is generally more appropriate in casual contexts
    const formality = context.formality || 0.5;
    const isAppropriate = formality < 0.7; // Less formal = more appropriate

    return {
      is_code_switched: analysis.is_code_switched,
      is_appropriate: isAppropriate,
      formality_level: formality,
      recommendation: isAppropriate
        ? 'Code-switching is appropriate for this context'
        : 'Consider using single language for formal context',
      authenticity_score: analysis.authenticity_score
    };
  }

  /**
   * Get code-switching statistics
   *
   * @param {string} text - Input text
   * @returns {Object} Detailed statistics
   */
  getStats(text) {
    const analysis = this.detectSwitching(text);

    const languageCounts = {};
    analysis.segments.forEach(seg => {
      languageCounts[seg.language] = (languageCounts[seg.language] || 0) + 1;
    });

    return {
      total_segments: analysis.segments.length,
      switch_points: analysis.switch_count,
      languages: analysis.languages_detected,
      language_distribution: languageCounts,
      dominant_language: Object.keys(languageCounts).reduce((a, b) =>
        languageCounts[a] > languageCounts[b] ? a : b
      ),
      authenticity_score: analysis.authenticity_score,
      is_natural: analysis.is_natural
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Detect language of a single word
   */
  _detectWordLanguage(word) {
    const lowerWord = word.toLowerCase().replace(/[.,!?;]/g, '');
    let scores = {
      papiamentu: 0,
      english: 0,
      dutch: 0,
      spanish: 0
    };

    // Score against each language's markers
    for (const [lang, data] of Object.entries(this.languageMarkers)) {
      if (data.markers.includes(lowerWord)) {
        scores[lang] += data.weight;
      }
    }

    // Return language with highest score
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'unknown';

    return Object.keys(scores).find(lang => scores[lang] === maxScore) || 'unknown';
  }

  /**
   * Match text against common code-switching patterns
   */
  _matchCodeSwitchingPatterns(text) {
    const matches = [];

    for (const pattern of this.commonPatterns) {
      if (pattern.pattern.test(text)) {
        matches.push({
          pattern: pattern.pattern.source,
          languages: pattern.languages,
          authenticity: pattern.authenticity,
          example: pattern.example
        });
      }
    }

    return matches;
  }

  /**
   * Score authenticity of code-switching
   */
  _scoreAuthenticity(segments, matchedPatterns) {
    // Base score
    let score = 0.5;

    // Boost for matching common patterns
    if (matchedPatterns.length > 0) {
      const avgPatternAuthenticity = matchedPatterns.reduce((sum, p) => sum + p.authenticity, 0) / matchedPatterns.length;
      score += avgPatternAuthenticity * 0.3;
    }

    // Boost for natural switch points
    const hasNaturalSwitches = this._hasNaturalSwitchPoints(segments);
    if (hasNaturalSwitches) {
      score += 0.2;
    }

    // Penalize for too many switches (unnatural)
    if (segments.length > 5) {
      score -= 0.1 * (segments.length - 5);
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Check if segments have natural switch points
   */
  _hasNaturalSwitchPoints(segments) {
    // Check if language switches occur at natural points
    // (verbs, adjectives, time expressions, etc.)

    // Simplified check for now
    for (const segment of segments) {
      const words = segment.text.split(/\s+/);
      for (const category of Object.values(this.switchPoints)) {
        if (words.some(w => category.includes(w.toLowerCase()))) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get example code-switched phrases
   */
  getExamples() {
    return {
      natural: [
        {
          text: 'Mi ta feeling bon today',
          languages: ['papiamentu', 'english'],
          translation: 'I am feeling good today',
          authenticity: 0.9
        },
        {
          text: 'Nos ta going beach mañana',
          languages: ['papiamentu', 'english', 'spanish'],
          translation: 'We are going to the beach tomorrow',
          authenticity: 0.85
        },
        {
          text: 'E ta muy busy hasi trabou',
          languages: ['papiamentu', 'spanish'],
          translation: 'He/She is very busy working',
          authenticity: 0.8
        }
      ],
      unnatural: [
        {
          text: 'The mi is feeling tabata',
          languages: ['english', 'papiamentu'],
          note: 'Random mixing without pattern',
          authenticity: 0.2
        }
      ]
    };
  }
}

export default new CodeSwitchingHandler();

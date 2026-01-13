import { logger } from '../../utils/logger.js';
import papiamentuNLP from '../nlp/PapiamentuNLP.js';

/**
 * Caribbean-Calibrated Emotion Analyzer
 *
 * Emotion detection system specifically tuned for Caribbean culture
 * where emotions are expressed more openly and warmly than Western norms.
 *
 * Key Differences from Western Models:
 * - More expressive baseline (dushi, stima, fresku)
 * - Community-focused emotions (nos, huntu)
 * - Indirect communication for negative emotions (respeto)
 * - Higher emotional warmth baseline
 *
 * Detects 6 Primary Emotions:
 * 1. Joy (alegria, kontentu, felis)
 * 2. Sadness (tristesa, dolor)
 * 3. Anger (korashi, rabia)
 * 4. Fear (miedo, susto)
 * 5. Love (stima, amor)
 * 6. Pride (orguyo)
 *
 * Plus secondary emotions and cultural emotional states
 */
class EmotionAnalyzer {
  constructor() {
    // Caribbean emotion vocabulary with intensity weights
    this.emotionVocabulary = {
      // JOY family (higher baseline in Caribbean culture)
      joy: {
        high: [
          { word: 'alegria', intensity: 0.95, cultural_marker: true },
          { word: 'felis', intensity: 0.90, cultural_marker: true },
          { word: 'kontentu', intensity: 0.85, cultural_marker: true },
          { word: 'dushi', intensity: 0.88, cultural_marker: true }, // Sweet/nice
          { word: 'fresku', intensity: 0.80, cultural_marker: true }, // Fresh/cool
          { word: 'bon', intensity: 0.75, cultural_marker: false },
          { word: 'happy', intensity: 0.85, cultural_marker: false },
          { word: 'feliz', intensity: 0.90, cultural_marker: false }
        ],
        medium: [
          { word: 'kontento', intensity: 0.65, cultural_marker: true },
          { word: 'satisfecho', intensity: 0.60, cultural_marker: false },
          { word: 'agradabel', intensity: 0.55, cultural_marker: true }
        ],
        low: [
          { word: 'ok', intensity: 0.40, cultural_marker: false },
          { word: 'bien', intensity: 0.45, cultural_marker: false }
        ]
      },

      // LOVE family (very important in Caribbean culture)
      love: {
        high: [
          { word: 'stima', intensity: 0.95, cultural_marker: true }, // Deep love
          { word: 'amor', intensity: 0.93, cultural_marker: true },
          { word: 'kier', intensity: 0.85, cultural_marker: true }, // Want/like
          { word: 'adora', intensity: 0.92, cultural_marker: false },
          { word: 'kариño', intensity: 0.88, cultural_marker: false }
        ],
        medium: [
          { word: 'gusta', intensity: 0.65, cultural_marker: true }, // Like
          { word: 'apresia', intensity: 0.70, cultural_marker: false }
        ],
        low: [
          { word: 'simpatia', intensity: 0.50, cultural_marker: false }
        ]
      },

      // SADNESS family (expressed but with community support)
      sadness: {
        high: [
          { word: 'dolor', intensity: 0.95, cultural_marker: true }, // Pain/sorrow
          { word: 'tristesa', intensity: 0.90, cultural_marker: true },
          { word: 'tristo', intensity: 0.88, cultural_marker: true },
          { word: 'sufri', intensity: 0.92, cultural_marker: true },
          { word: 'yora', intensity: 0.85, cultural_marker: true } // Cry
        ],
        medium: [
          { word: 'pena', intensity: 0.65, cultural_marker: true },
          { word: 'melankoliko', intensity: 0.60, cultural_marker: false }
        ],
        low: [
          { word: 'desanima', intensity: 0.50, cultural_marker: true }
        ]
      },

      // ANGER family (direct but respectful)
      anger: {
        high: [
          { word: 'korashi', intensity: 0.95, cultural_marker: true }, // Rage
          { word: 'rabia', intensity: 0.93, cultural_marker: true },
          { word: 'bisti', intensity: 0.90, cultural_marker: true }, // Beast/furious
          { word: 'indigna', intensity: 0.88, cultural_marker: false }
        ],
        medium: [
          { word: 'molesta', intensity: 0.70, cultural_marker: true }, // Bothered
          { word: 'irritá', intensity: 0.65, cultural_marker: true },
          { word: 'enfadá', intensity: 0.68, cultural_marker: false }
        ],
        low: [
          { word: 'fastidia', intensity: 0.50, cultural_marker: true }
        ]
      },

      // FEAR family
      fear: {
        high: [
          { word: 'miedo', intensity: 0.95, cultural_marker: true },
          { word: 'susto', intensity: 0.90, cultural_marker: true }, // Fright
          { word: 'spanta', intensity: 0.88, cultural_marker: true }, // Scared
          { word: 'panik', intensity: 0.93, cultural_marker: false }
        ],
        medium: [
          { word: 'nervioso', intensity: 0.65, cultural_marker: true },
          { word: 'preokupá', intensity: 0.60, cultural_marker: true }
        ],
        low: [
          { word: 'duда', intensity: 0.50, cultural_marker: true }
        ]
      },

      // PRIDE family (cultural value)
      pride: {
        high: [
          { word: 'orguyo', intensity: 0.95, cultural_marker: true },
          { word: 'orguyoso', intensity: 0.93, cultural_marker: true },
          { word: 'honrá', intensity: 0.90, cultural_marker: true }
        ],
        medium: [
          { word: 'satisfecho', intensity: 0.70, cultural_marker: true }
        ],
        low: [
          { word: 'kontentu di mi mes', intensity: 0.60, cultural_marker: true }
        ]
      }
    };

    // Secondary emotions
    this.secondaryEmotions = {
      gratitude: ['danki', 'agradesi', 'gratesido'],
      shame: ['berguensa', 'pena'],
      surprise: ['sörpresa', 'asombra'],
      disgust: ['asco', 'repugnante'],
      hope: ['speransa', 'konfia'],
      loneliness: ['soledad', 'solu']
    };

    // Cultural emotional intensifiers
    this.intensifiers = {
      very: ['hopi', 'masha', 'muy', 'demas', 'mescos'], // Very/too much
      somewhat: ['algu', 'un tiki', 'kasi'], // Somewhat/a little
      negation: ['no', 'nunka', 'nada'] // No/never/nothing
    };

    // Emotional tone indicators
    this.toneMarkers = {
      exclamation: /[!¡]/g,
      question: /[?¿]/g,
      emphasis: /[A-Z]{2,}/g,
      emoticons: /[😊😃😄😁🙂😢😭😡😠😨😱❤️💕💖]/g
    };
  }

  /**
   * Detect primary emotion in text
   *
   * @param {string} text - Input text
   * @returns {Object} Primary emotion with intensity
   */
  detectEmotion(text) {
    const startTime = Date.now();
    const lowerText = text.toLowerCase();

    logger.info('Detecting emotion', { text_length: text.length });

    // Score each emotion category
    const emotionScores = {};
    const detectedEmotions = [];

    // Check each primary emotion
    for (const [emotion, levels] of Object.entries(this.emotionVocabulary)) {
      let score = 0;
      const markers = [];

      // Check all intensity levels
      for (const level of Object.values(levels)) {
        for (const entry of level) {
          if (lowerText.includes(entry.word)) {
            score += entry.intensity;
            markers.push({
              word: entry.word,
              intensity: entry.intensity,
              cultural_marker: entry.cultural_marker
            });
          }
        }
      }

      if (score > 0) {
        emotionScores[emotion] = score;
        detectedEmotions.push({
          emotion,
          score,
          markers
        });
      }
    }

    // Check secondary emotions
    const secondaryDetected = [];
    for (const [emotion, words] of Object.entries(this.secondaryEmotions)) {
      for (const word of words) {
        if (lowerText.includes(word)) {
          secondaryDetected.push(emotion);
          break;
        }
      }
    }

    // Determine primary emotion
    const primary = detectedEmotions.length > 0
      ? detectedEmotions.reduce((max, e) => e.score > max.score ? e : max)
      : null;

    // Calculate intensity with intensifiers
    const baseIntensity = primary ? primary.score : 0;
    const adjustedIntensity = this._adjustIntensity(lowerText, baseIntensity);

    // Detect tone
    const tone = this._analyzeTone(text);

    // Calculate confidence
    const confidence = primary
      ? Math.min(primary.score / 2.0, 1.0)
      : 0.0;

    // Get cultural markers
    const culturalMarkers = primary
      ? primary.markers.filter(m => m.cultural_marker).map(m => m.word)
      : [];

    const result = {
      text,
      primary: primary ? primary.emotion : 'neutral',
      secondary: secondaryDetected,
      intensity: Math.min(adjustedIntensity, 1.0),
      confidence,
      tone,
      cultural_markers: culturalMarkers,
      has_cultural_emotion: culturalMarkers.length > 0,
      all_emotions_detected: detectedEmotions.map(e => ({
        emotion: e.emotion,
        score: e.score
      })),
      processing_time_ms: Date.now() - startTime
    };

    logger.info('Emotion detection complete', {
      primary: result.primary,
      intensity: result.intensity.toFixed(2),
      confidence: result.confidence.toFixed(2)
    });

    return result;
  }

  /**
   * Analyze sentiment (positive, neutral, negative)
   * Caribbean-calibrated with higher warmth baseline
   *
   * @param {string} text - Input text
   * @returns {Object} Sentiment analysis
   */
  analyzeSentiment(text) {
    const startTime = Date.now();

    logger.info('Analyzing sentiment', { text_length: text.length });

    const emotion = this.detectEmotion(text);

    // Map emotions to sentiment
    const positiveEmotions = ['joy', 'love', 'pride'];
    const negativeEmotions = ['sadness', 'anger', 'fear'];

    let sentiment = 'neutral';
    let score = 0;

    if (positiveEmotions.includes(emotion.primary)) {
      sentiment = 'positive';
      score = emotion.intensity * 0.8; // Caribbean baseline is more positive
    } else if (negativeEmotions.includes(emotion.primary)) {
      sentiment = 'negative';
      score = -emotion.intensity * 0.7; // Negative emotions less intense due to community support
    }

    // Caribbean warmth factor (baseline positive bias)
    const caribbeanWarmth = 0.15;
    score += caribbeanWarmth;

    // Normalize to -1 to 1
    score = Math.max(-1, Math.min(1, score));

    const result = {
      text,
      sentiment,
      score, // -1 (very negative) to 1 (very positive)
      confidence: emotion.confidence,
      primary_emotion: emotion.primary,
      intensity: emotion.intensity,
      caribbean_calibrated: true,
      warmth_factor: caribbeanWarmth,
      processing_time_ms: Date.now() - startTime
    };

    logger.info('Sentiment analysis complete', {
      sentiment: result.sentiment,
      score: result.score.toFixed(2)
    });

    return result;
  }

  /**
   * Detect tone (formal, casual, respectful, playful, etc)
   *
   * @param {string} text - Input text
   * @returns {Object} Tone analysis
   */
  detectTone(text) {
    const lowerText = text.toLowerCase();

    // Formality markers
    const formalMarkers = ['usted', 'señor', 'señora', 'por favor', 'agradecido'];
    const casualMarkers = ['bo', 'dushi', 'mi', 'nos', 'ayo'];

    let formalScore = 0;
    let casualScore = 0;

    formalMarkers.forEach(marker => {
      if (lowerText.includes(marker)) formalScore++;
    });

    casualMarkers.forEach(marker => {
      if (lowerText.includes(marker)) casualScore++;
    });

    // Determine formality level (0 = very casual, 1 = very formal)
    const totalMarkers = formalScore + casualScore;
    const formality = totalMarkers > 0
      ? formalScore / totalMarkers
      : 0.5; // Default to moderate

    // Warmth detection (Caribbean characteristic)
    const warmthMarkers = ['dushi', 'stima', 'bon', 'danki', 'amor'];
    let warmth = 0;
    warmthMarkers.forEach(marker => {
      if (lowerText.includes(marker)) warmth += 0.2;
    });
    warmth = Math.min(warmth, 1.0);

    // Detect playfulness
    const playfulMarkers = /[😊😃😄!]{2,}/;
    const isPlayful = playfulMarkers.test(text);

    // Determine primary tone
    let tone = 'neutral';
    if (warmth > 0.6) tone = 'warm';
    else if (formality > 0.7) tone = 'formal';
    else if (formality < 0.3) tone = 'casual';
    else if (isPlayful) tone = 'playful';

    return {
      tone,
      formality,
      warmth,
      is_respectful: formality > 0.5 || warmth > 0.5,
      is_playful: isPlayful,
      caribbean_warmth: warmth > 0.5
    };
  }

  /**
   * Assess emotional content comprehensively
   *
   * @param {string} text - Input text
   * @returns {Object} Complete emotional analysis
   */
  assessEmotionalContent(text) {
    const startTime = Date.now();

    logger.info('Assessing emotional content', { text_length: text.length });

    const emotion = this.detectEmotion(text);
    const sentiment = this.analyzeSentiment(text);
    const tone = this.detectTone(text);

    // Calculate empathy level (how empathetic the text is)
    const empathyMarkers = ['kompronde', 'sinti', 'empatia', 'apoyo', 'yuda'];
    let empathyLevel = 0;
    const lowerText = text.toLowerCase();
    empathyMarkers.forEach(marker => {
      if (lowerText.includes(marker)) empathyLevel += 0.25;
    });
    empathyLevel = Math.min(empathyLevel, 1.0);

    // Cultural appropriateness
    const culturalAppropriate = emotion.has_cultural_emotion || tone.caribbean_warmth;

    const result = {
      text,
      emotions: {
        primary: emotion.primary,
        secondary: emotion.secondary,
        intensity: emotion.intensity,
        cultural_markers: emotion.cultural_markers
      },
      sentiment: {
        label: sentiment.sentiment,
        score: sentiment.score,
        confidence: sentiment.confidence
      },
      tone: {
        type: tone.tone,
        formality: tone.formality,
        warmth: tone.warmth,
        respectful: tone.is_respectful
      },
      empathy_level: empathyLevel,
      cultural_appropriateness: culturalAppropriate ? 0.92 : 0.70,
      processing_time_ms: Date.now() - startTime
    };

    logger.info('Emotional assessment complete', {
      primary_emotion: result.emotions.primary,
      sentiment: result.sentiment.label,
      empathy: empathyLevel.toFixed(2)
    });

    return result;
  }

  /**
   * Get emotion statistics
   *
   * @returns {Object} Statistics about the emotion analyzer
   */
  getStats() {
    let totalWords = 0;
    for (const levels of Object.values(this.emotionVocabulary)) {
      for (const level of Object.values(levels)) {
        totalWords += level.length;
      }
    }

    return {
      primary_emotions: Object.keys(this.emotionVocabulary).length,
      secondary_emotions: Object.keys(this.secondaryEmotions).length,
      emotion_words: totalWords,
      intensifiers: Object.values(this.intensifiers).flat().length,
      caribbean_calibrated: true
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Adjust intensity based on intensifiers
   */
  _adjustIntensity(text, baseIntensity) {
    let adjusted = baseIntensity;

    // Check for intensifiers
    for (const word of this.intensifiers.very) {
      if (text.includes(word)) {
        adjusted *= 1.3; // Increase 30%
      }
    }

    // Check for diminishers
    for (const word of this.intensifiers.somewhat) {
      if (text.includes(word)) {
        adjusted *= 0.7; // Decrease 30%
      }
    }

    // Check for negation
    for (const word of this.intensifiers.negation) {
      if (text.includes(word)) {
        adjusted *= 0.5; // Reduce significantly
      }
    }

    return adjusted;
  }

  /**
   * Analyze tone from punctuation and formatting
   */
  _analyzeTone(text) {
    const exclamations = (text.match(this.toneMarkers.exclamation) || []).length;
    const questions = (text.match(this.toneMarkers.question) || []).length;
    const emphasis = (text.match(this.toneMarkers.emphasis) || []).length;
    const emoticons = (text.match(this.toneMarkers.emoticons) || []).length;

    return {
      exclamation_count: exclamations,
      question_count: questions,
      emphasis_count: emphasis,
      emoticon_count: emoticons,
      is_excited: exclamations > 1,
      is_questioning: questions > 0,
      is_emphatic: emphasis > 0 || emoticons > 0
    };
  }
}

export default new EmotionAnalyzer();

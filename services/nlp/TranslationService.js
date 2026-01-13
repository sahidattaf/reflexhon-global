import { logger } from '../../utils/logger.js';
import papiamentuNLP from './PapiamentuNLP.js';
import papiamentuDictionary from './PapiamentuDictionary.js';
import aiService from '../reflexion/AIService.js';

/**
 * Translation Service for Papiamentu ↔ English
 *
 * Multi-strategy translation system:
 * 1. Dictionary-based (fast, accurate for common words)
 * 2. AI-powered (Cloudflare Workers AI with M2M100)
 * 3. Hybrid approach (combines both methods)
 *
 * Features:
 * - Papiamentu → English translation
 * - English → Papiamentu translation (with dialect support)
 * - Cultural context preservation
 * - Confidence scoring
 * - Alternative translations
 * - Caching for common phrases
 */
class TranslationService {
  constructor() {
    // Translation cache (common phrases)
    this.cache = new Map();
    this.cacheTTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    // Common phrase translations (high-quality curated translations)
    this.phraseTranslations = {
      // Papiamentu → English
      pap_to_eng: {
        'bon dia': 'good morning',
        'bon tardi': 'good afternoon',
        'bon nochi': 'good evening / good night',
        'kon bo ta': 'how are you',
        'mi ta bon': 'I am fine',
        'danki': 'thank you',
        'masha danki': 'thank you very much',
        'di nada': 'you\'re welcome',
        'por fabor': 'please',
        'perdon': 'sorry / excuse me',
        'asina mes': 'exactly / that\'s right',
        'kiko ta empatia': 'what is empathy',
        'kiko ta respeto': 'what is respect',
        'mi ke sa': 'I want to know',
        'kon nos por': 'how can we',
        'mi ta stima bo': 'I love you',
        'nos ta huntu': 'we are together',
        'famia ta importante': 'family is important',
        'respeto ta esensial': 'respect is essential',
        'kon dushi': 'how sweet / how nice'
      },

      // English → Papiamentu
      eng_to_pap: {
        'good morning': 'bon dia',
        'good afternoon': 'bon tardi',
        'good evening': 'bon nochi',
        'good night': 'bon nochi',
        'how are you': 'kon bo ta',
        'i am fine': 'mi ta bon',
        'thank you': 'danki',
        'thank you very much': 'masha danki',
        'you\'re welcome': 'di nada',
        'please': 'por fabor',
        'sorry': 'perdon',
        'excuse me': 'perdon',
        'exactly': 'asina mes',
        'what is empathy': 'kiko ta empatia',
        'what is respect': 'kiko ta respeto',
        'i want to know': 'mi ke sa',
        'how can we': 'kon nos por',
        'i love you': 'mi ta stima bo',
        'we are together': 'nos ta huntu',
        'family is important': 'famia ta importante',
        'respect is essential': 'respeto ta esensial'
      }
    };

    // Warmup cache with common phrases
    this._warmupCache();
  }

  /**
   * Translate Papiamentu to English
   *
   * @param {string} text - Papiamentu text
   * @param {Object} options - Translation options
   * @returns {Promise<Object>} Translation result
   */
  async translateToEnglish(text, options = {}) {
    const startTime = Date.now();

    logger.info('Translating Papiamentu → English', {
      text_length: text.length,
      method: options.method || 'auto'
    });

    try {
      // Check cache first
      const cacheKey = `pap_eng:${text.toLowerCase()}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        logger.debug('Cache hit for translation');
        return {
          ...cached.translation,
          cached: true
        };
      }

      // Strategy 1: Check phrase translations (most accurate)
      const lowerText = text.toLowerCase().trim();
      if (this.phraseTranslations.pap_to_eng[lowerText]) {
        const translation = this.phraseTranslations.pap_to_eng[lowerText];
        const result = {
          original: text,
          translation,
          source_language: 'papiamentu',
          target_language: 'english',
          method: 'phrase_dictionary',
          confidence: 1.0,
          cultural_notes: this._getCulturalNotes(text, 'pap'),
          alternative_translations: [],
          processing_time_ms: Date.now() - startTime
        };

        this._cacheTranslation(cacheKey, result);
        return result;
      }

      // Strategy 2: Word-by-word dictionary translation
      const dictionaryResult = await this._translateWithDictionary(text, 'pap_to_eng');
      if (dictionaryResult.confidence > 0.7) {
        dictionaryResult.processing_time_ms = Date.now() - startTime;
        this._cacheTranslation(cacheKey, dictionaryResult);
        return dictionaryResult;
      }

      // Strategy 3: AI-powered translation (if available)
      if (options.ai) {
        const aiResult = await this._translateWithAI(
          text,
          'papiamentu',
          'english',
          options.ai
        );

        if (aiResult.success) {
          const result = {
            original: text,
            translation: aiResult.translation,
            source_language: 'papiamentu',
            target_language: 'english',
            method: 'ai_translation',
            confidence: aiResult.confidence || 0.8,
            cultural_notes: this._getCulturalNotes(text, 'pap'),
            alternative_translations: dictionaryResult.confidence > 0.5
              ? [dictionaryResult.translation]
              : [],
            processing_time_ms: Date.now() - startTime
          };

          this._cacheTranslation(cacheKey, result);
          return result;
        }
      }

      // Fallback: Return dictionary result even if low confidence
      dictionaryResult.processing_time_ms = Date.now() - startTime;
      dictionaryResult.warning = 'Low confidence translation. AI translation recommended.';
      return dictionaryResult;

    } catch (error) {
      logger.error('Translation failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        original: text,
        processing_time_ms: Date.now() - startTime
      };
    }
  }

  /**
   * Translate English to Papiamentu
   *
   * @param {string} text - English text
   * @param {string} dialect - Target dialect (aruba, bonaire, curacao)
   * @param {Object} options - Translation options
   * @returns {Promise<Object>} Translation result
   */
  async translateToPapiamentu(text, dialect = 'aruba', options = {}) {
    const startTime = Date.now();

    logger.info('Translating English → Papiamentu', {
      text_length: text.length,
      dialect,
      method: options.method || 'auto'
    });

    try {
      // Check cache first
      const cacheKey = `eng_pap_${dialect}:${text.toLowerCase()}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        logger.debug('Cache hit for translation');
        return {
          ...cached.translation,
          cached: true
        };
      }

      // Strategy 1: Check phrase translations
      const lowerText = text.toLowerCase().trim();
      if (this.phraseTranslations.eng_to_pap[lowerText]) {
        const translation = this.phraseTranslations.eng_to_pap[lowerText];
        const dialectAdjusted = this._adjustForDialect(translation, dialect);

        const result = {
          original: text,
          translation: dialectAdjusted,
          source_language: 'english',
          target_language: 'papiamentu',
          dialect,
          method: 'phrase_dictionary',
          confidence: 1.0,
          cultural_notes: this._getCulturalNotes(dialectAdjusted, 'eng'),
          alternative_translations: [],
          processing_time_ms: Date.now() - startTime
        };

        this._cacheTranslation(cacheKey, result);
        return result;
      }

      // Strategy 2: Word-by-word dictionary translation
      const dictionaryResult = await this._translateWithDictionary(text, 'eng_to_pap', dialect);
      if (dictionaryResult.confidence > 0.7) {
        dictionaryResult.processing_time_ms = Date.now() - startTime;
        this._cacheTranslation(cacheKey, dictionaryResult);
        return dictionaryResult;
      }

      // Strategy 3: AI-powered translation (if available)
      if (options.ai) {
        const aiResult = await this._translateWithAI(
          text,
          'english',
          'papiamentu',
          options.ai,
          { dialect }
        );

        if (aiResult.success) {
          const dialectAdjusted = this._adjustForDialect(aiResult.translation, dialect);

          const result = {
            original: text,
            translation: dialectAdjusted,
            source_language: 'english',
            target_language: 'papiamentu',
            dialect,
            method: 'ai_translation',
            confidence: aiResult.confidence || 0.8,
            cultural_notes: this._getCulturalNotes(dialectAdjusted, 'eng'),
            alternative_translations: dictionaryResult.confidence > 0.5
              ? [dictionaryResult.translation]
              : [],
            processing_time_ms: Date.now() - startTime
          };

          this._cacheTranslation(cacheKey, result);
          return result;
        }
      }

      // Fallback: Return dictionary result even if low confidence
      dictionaryResult.processing_time_ms = Date.now() - startTime;
      dictionaryResult.warning = 'Low confidence translation. AI translation recommended.';
      return dictionaryResult;

    } catch (error) {
      logger.error('Translation failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        original: text,
        processing_time_ms: Date.now() - startTime
      };
    }
  }

  /**
   * Improve existing translation for specific dialect
   *
   * @param {string} text - Papiamentu text
   * @param {string} targetDialect - Target dialect
   * @returns {Object} Improved translation
   */
  async improveTranslation(text, targetDialect) {
    logger.info('Improving translation for dialect', { targetDialect });

    // Analyze current dialect
    const currentDialect = papiamentuNLP.detectDialect(text);

    // If already in target dialect, return as-is
    if (currentDialect.dialect === targetDialect && currentDialect.confidence > 0.7) {
      return {
        original: text,
        improved: text,
        dialect: targetDialect,
        changes_made: 0,
        note: 'Text already matches target dialect'
      };
    }

    // Adjust for target dialect
    const improved = this._adjustForDialect(text, targetDialect);

    return {
      original: text,
      improved,
      source_dialect: currentDialect.dialect,
      target_dialect: targetDialect,
      changes_made: text !== improved ? 1 : 0,
      confidence: 0.8
    };
  }

  /**
   * Get translation cache statistics
   *
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      phrases_cached: Object.keys(this.phraseTranslations.pap_to_eng).length +
                     Object.keys(this.phraseTranslations.eng_to_pap).length,
      ttl_days: this.cacheTTL / (24 * 60 * 60 * 1000)
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Translate using dictionary (word-by-word)
   */
  async _translateWithDictionary(text, direction, dialect = 'aruba') {
    const words = text.split(/\s+/);
    const translations = [];
    let successCount = 0;

    for (const word of words) {
      const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, '');

      if (direction === 'pap_to_eng') {
        const translation = papiamentuDictionary.translateWord(cleanWord);
        if (translation) {
          translations.push(translation);
          successCount++;
        } else {
          translations.push(cleanWord); // Keep original if no translation
        }
      } else {
        // eng_to_pap: Would need reverse dictionary (simplified for now)
        translations.push(cleanWord);
      }
    }

    const confidence = words.length > 0 ? successCount / words.length : 0;

    return {
      original: text,
      translation: translations.join(' '),
      source_language: direction === 'pap_to_eng' ? 'papiamentu' : 'english',
      target_language: direction === 'pap_to_eng' ? 'english' : 'papiamentu',
      method: 'dictionary',
      confidence,
      words_translated: successCount,
      total_words: words.length,
      ...(direction === 'eng_to_pap' && { dialect })
    };
  }

  /**
   * Translate using AI (Cloudflare Workers AI)
   */
  async _translateWithAI(text, sourceLang, targetLang, ai, options = {}) {
    try {
      logger.debug('Using AI for translation', { sourceLang, targetLang });

      // Use Cloudflare Workers AI translation model
      const result = await aiService.runTranslation(ai, text, sourceLang, targetLang);

      if (result.success) {
        // Post-process with Papiamentu knowledge
        let translation = result.output;

        // Validate translation quality
        const isValid = this._validateTranslation(text, translation, sourceLang, targetLang);

        return {
          success: true,
          translation,
          confidence: isValid ? 0.85 : 0.6,
          model: result.model
        };
      }

      return {
        success: false,
        error: 'AI translation failed'
      };

    } catch (error) {
      logger.error('AI translation error', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Adjust translation for specific dialect
   */
  _adjustForDialect(text, dialect) {
    // For now, this is simplified
    // In a full implementation, we'd have dialect-specific rules

    // Example: Aruba dialect might prefer certain word choices
    if (dialect === 'aruba') {
      // Aruba-specific adjustments
      return text;
    } else if (dialect === 'bonaire') {
      // Bonaire-specific adjustments
      return text;
    } else if (dialect === 'curacao') {
      // Curaçao-specific adjustments
      return text;
    }

    return text;
  }

  /**
   * Get cultural notes for translation
   */
  _getCulturalNotes(text, direction) {
    const notes = [];

    // Check for cultural concepts that need explanation
    const culturalConcepts = {
      empatia: 'In Caribbean culture, empathy (empatia) is deeply tied to community values',
      respeto: 'Respect (respeto) is a fundamental value in Caribbean culture',
      famia: 'Family (famia) holds central importance in Caribbean society',
      dushi: 'Dushi is a term of endearment unique to Papiamentu culture',
      nos: 'Nos (we/us) reflects the communal nature of Caribbean culture'
    };

    const lowerText = text.toLowerCase();
    for (const [concept, note] of Object.entries(culturalConcepts)) {
      if (lowerText.includes(concept)) {
        notes.push(note);
      }
    }

    return notes;
  }

  /**
   * Validate translation quality
   */
  _validateTranslation(source, target, sourceLang, targetLang) {
    // Basic validation checks
    if (!target || target.length === 0) return false;
    if (source.length > 0 && target.length === 0) return false;

    // Check if translation makes sense (simplified)
    const sourceWords = source.split(/\s+/).length;
    const targetWords = target.split(/\s+/).length;

    // Translation shouldn't be too different in length (rule of thumb)
    const ratio = targetWords / sourceWords;
    if (ratio < 0.3 || ratio > 3.0) return false;

    return true;
  }

  /**
   * Cache translation result
   */
  _cacheTranslation(key, translation) {
    this.cache.set(key, {
      translation,
      timestamp: Date.now()
    });

    logger.debug('Translation cached', { key });
  }

  /**
   * Warmup cache with common phrases
   */
  _warmupCache() {
    logger.info('Warming up translation cache...');

    let count = 0;

    // Cache all phrase translations
    for (const [pap, eng] of Object.entries(this.phraseTranslations.pap_to_eng)) {
      const key = `pap_eng:${pap}`;
      const translation = {
        original: pap,
        translation: eng,
        source_language: 'papiamentu',
        target_language: 'english',
        method: 'phrase_dictionary',
        confidence: 1.0,
        cached: true
      };
      this._cacheTranslation(key, translation);
      count++;
    }

    for (const [eng, pap] of Object.entries(this.phraseTranslations.eng_to_pap)) {
      const key = `eng_pap_aruba:${eng}`;
      const translation = {
        original: eng,
        translation: pap,
        source_language: 'english',
        target_language: 'papiamentu',
        dialect: 'aruba',
        method: 'phrase_dictionary',
        confidence: 1.0,
        cached: true
      };
      this._cacheTranslation(key, translation);
      count++;
    }

    logger.info(`Translation cache warmed up with ${count} phrases`);
  }
}

export default new TranslationService();

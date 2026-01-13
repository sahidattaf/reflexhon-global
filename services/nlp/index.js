/**
 * Papiamentu NLP Module
 *
 * Comprehensive Natural Language Processing for Papiamentu
 * The world's first advanced NLP system for Caribbean Papiamentu language
 */

import papiamentuNLP from './PapiamentuNLP.js';
import papiamentuDictionary from './PapiamentuDictionary.js';
import translationService from './TranslationService.js';
import codeSwitchingHandler from './CodeSwitchingHandler.js';

export {
  papiamentuNLP,
  papiamentuDictionary,
  translationService,
  codeSwitchingHandler
};

export default {
  nlp: papiamentuNLP,
  dictionary: papiamentuDictionary,
  translation: translationService,
  codeSwitching: codeSwitchingHandler
};

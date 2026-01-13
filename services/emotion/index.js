/**
 * Emotion Analysis Module
 *
 * Caribbean-calibrated emotion and empathy system
 */

import emotionAnalyzer from './EmotionAnalyzer.js';
import empathyEngine from './EmpathyEngine.js';

export {
  emotionAnalyzer,
  empathyEngine
};

export default {
  emotion: emotionAnalyzer,
  empathy: empathyEngine
};

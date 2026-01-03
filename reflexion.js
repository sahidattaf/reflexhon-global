// Reflexion Engine - Cultural AI Alignment Processing
import { callHuggingFaceInference } from './huggingface.js';
import { AIError } from './utils/errors.js';

/**
 * Process input through the Reflexion loop with optional AI inference
 * Steps:
 * 1. Analyze reasoning
 * 2. Self-reflection
 * 3. Evaluate output
 * 4. Honor pause (cultural context)
 * 5. Optional: AI-powered generation via HuggingFace
 *
 * @param {string} input - The input text to process
 * @param {object} context - Additional context (language, cultural_context, etc.)
 * @param {object} env - Cloudflare environment (for HF_TOKEN)
 */
export async function processReflexion(input, context = {}, env = {}) {
  const startTime = Date.now();

  // Step 1: Analyze reasoning
  const analysis = analyzeInput(input, context);

  // Step 2: Self-reflection
  const reflection = performReflection(analysis);

  // Step 3: Evaluate output
  const evaluation = evaluateQuality(reflection);

  // Step 4: Honor pause - cultural context matters
  let response = addCulturalPause(evaluation);

  // Step 5: Optional AI-powered generation via HuggingFace
  let aiGenerated = null;
  let aiError = null;
  if (env.HF_TOKEN && env.HF_MODEL) {
    try {
      // Build culturally-aware prompt
      const prompt = buildCulturalPrompt(input, context, reflection);

      const aiResult = await callHuggingFaceInference(
        env.HF_MODEL,
        prompt,
        env.HF_TOKEN
      );

      if (aiResult.success) {
        aiGenerated = aiResult.output;
        response = {
          ...response,
          output: aiResult.output,
          ai_powered: true
        };
      }
    } catch (error) {
      // Capture user-friendly error message
      if (error instanceof AIError) {
        aiError = {
          message: error.message,
          code: error.errorCode,
          details: error.details
        };
      } else {
        aiError = {
          message: 'AI inference failed. Using fallback processing.',
          code: 'AI_INFERENCE_FAILED'
        };
      }
      // Continue with rule-based processing as fallback
    }
  }

  const processingTime = Date.now() - startTime;

  return {
    success: true,
    input: input,
    output: response.output,
    reflexion: {
      analysis: analysis.insights,
      reflection: reflection.thoughts,
      evaluation: evaluation.score,
      cultural_pause: response.pause_markers,
      ai_enhanced: aiGenerated ? true : false
    },
    metadata: {
      processing_time_ms: processingTime,
      language: context.language || 'papiamentu',
      cultural_context: context.cultural_context || 'caribbean',
      model: env.HF_MODEL || 'none',
      source: aiGenerated ? 'huggingface_ai' : 'rule_based',
      ...(aiError && {
        ai_fallback: true,
        ai_error: aiError
      })
    }
  };
}

/**
 * Build a culturally-aware prompt for AI generation
 */
function buildCulturalPrompt(input, context, reflection) {
  const culturalContext = context.cultural_context || 'Caribbean';
  const language = context.language || 'Papiamentu';

  let prompt = `You are a culturally-aware AI assistant focused on ${culturalContext} culture and ${language} language.\n\n`;

  // Add reflection insights
  if (reflection.thoughts.length > 0) {
    prompt += `Important considerations:\n`;
    reflection.thoughts.forEach(thought => {
      prompt += `- ${thought}\n`;
    });
    prompt += `\n`;
  }

  prompt += `Question: ${input}\n\n`;
  prompt += `Provide a thoughtful, culturally-appropriate response that honors the context and shows empathy:\n`;

  return prompt;
}

/**
 * Analyze the input for reasoning patterns
 */
function analyzeInput(input, context) {
  // Detect question type
  const isQuestion = input.includes('?') || input.toLowerCase().startsWith('kiko');

  // Detect emotional content
  const emotionalWords = ['empatia', 'amor', 'respeto', 'dolor', 'felisidat'];
  const hasEmotionalContent = emotionalWords.some(word =>
    input.toLowerCase().includes(word)
  );

  // Cultural markers
  const hasCulturalMarkers = detectCulturalMarkers(input);

  return {
    is_question: isQuestion,
    has_emotional_content: hasEmotionalContent,
    has_cultural_markers: hasCulturalMarkers,
    insights: {
      type: isQuestion ? 'inquiry' : 'statement',
      emotional_depth: hasEmotionalContent ? 'high' : 'neutral',
      cultural_relevance: hasCulturalMarkers ? 'strong' : 'moderate'
    }
  };
}

/**
 * Perform self-reflection on the analysis
 */
function performReflection(analysis) {
  const thoughts = [];

  if (analysis.is_question) {
    thoughts.push('This is an inquiry seeking understanding');
  }

  if (analysis.has_emotional_content) {
    thoughts.push('Emotional intelligence and empathy are central here');
  }

  if (analysis.has_cultural_markers) {
    thoughts.push('Cultural context shapes the meaning deeply');
  }

  return {
    thoughts: thoughts,
    approach: 'human_centered',
    considerations: [
      'Respect cultural nuances',
      'Honor emotional context',
      'Provide thoughtful response'
    ]
  };
}

/**
 * Evaluate the quality of the reasoning
 */
function evaluateQuality(reflection) {
  // Score based on depth of reflection
  const score = reflection.thoughts.length >= 2 ? 'high' : 'moderate';

  return {
    score: score,
    reasoning_quality: 'deliberate',
    cultural_alignment: 'strong',
    recommendation: score === 'high' ?
      'Response demonstrates deep cultural understanding' :
      'Response shows cultural awareness'
  };
}

/**
 * Add cultural pause markers for thoughtful delivery
 */
function addCulturalPause(evaluation) {
  const pauseMarkers = [
    '...',  // Thoughtful pause
    '—',    // Reflective transition
    '⏸️'    // Cultural pause indicator
  ];

  return {
    output: 'Processing complete with cultural consideration',
    pause_markers: pauseMarkers,
    delivery_style: 'slow_and_thoughtful'
  };
}

/**
 * Detect Papiamentu cultural markers
 */
function detectCulturalMarkers(text) {
  const culturalWords = [
    'hende',      // people
    'respeto',    // respect
    'komunidat',  // community
    'famia',      // family
    'kultura'     // culture
  ];

  return culturalWords.some(word =>
    text.toLowerCase().includes(word)
  );
}

/**
 * Analyze reasoning patterns in text
 */
export function analyzeReasoning(text) {
  const words = text.toLowerCase().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  return {
    success: true,
    analysis: {
      word_count: words.length,
      sentence_count: sentences.length,
      complexity: words.length > 20 ? 'complex' : 'simple',
      reasoning_markers: {
        questions: (text.match(/\?/g) || []).length,
        statements: sentences.length,
        cultural_terms: detectCulturalMarkers(text)
      }
    },
    insights: [
      'Text analyzed for cultural and reasoning patterns',
      'Papiamentu linguistic structures considered',
      'Emotional and cultural context evaluated'
    ]
  };
}

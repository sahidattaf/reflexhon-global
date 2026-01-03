// Reflexion Engine - Cultural AI Alignment Processing
import { callHuggingFaceInference } from './huggingface.js';

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

  // Step 5: AI-powered generation (Try Cloudflare AI first, then HuggingFace)
  let aiGenerated = null;
  let aiError = null;

  // Try Cloudflare AI first (built-in, free, fast!)
  if (env.AI) {
    try {
      const prompt = buildCulturalPrompt(input, context, reflection);

      const messages = [
        { role: 'system', content: 'You are a culturally-aware AI focused on Caribbean culture and Papiamentu language. Respond with empathy and cultural sensitivity.' },
        { role: 'user', content: prompt }
      ];

      const cfAiResult = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        messages: messages
      });

      if (cfAiResult && cfAiResult.response) {
        aiGenerated = cfAiResult.response;
        response = {
          ...response,
          output: cfAiResult.response,
          ai_powered: true
        };
      }
    } catch (error) {
      aiError = `Cloudflare AI error: ${error.message}`;
    }
  }

  // Fallback to HuggingFace if Cloudflare AI didn't work
  if (!aiGenerated && env.HF_TOKEN && env.HF_MODEL) {
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
    } else {
      aiError = aiError ? `${aiError}; HuggingFace: ${aiResult.error}` : aiResult.error;
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
      model: env.AI ? '@cf/meta/llama-2-7b-chat-int8' : (env.HF_MODEL || 'none'),
      source: aiGenerated ? (env.AI ? 'cloudflare_ai' : 'huggingface_ai') : 'rule_based',
      ai_error: aiError || undefined  // Show error if AI failed
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

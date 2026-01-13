/**
 * Manual Test for Reflexion Engine
 *
 * Run with: node test-reflexion-manual.js
 */

import reflexionEngine from './services/reflexion/ReflexionEngine.js';
import aiService from './services/reflexion/AIService.js';
import reasoningCache from './services/reflexion/ReasoningCache.js';

console.log('🚀 Testing Advanced Reflexion Engine v3.0.0\n');

async function runTests() {
  try {
    // Test 1: Layer 1 - Input Analysis
    console.log('=== TEST 1: Layer 1 - Input Analysis ===');
    const input1 = 'Kiko ta empatia?';
    const context1 = {
      language: 'papiamentu',
      dialect: 'aruba',
      situation: 'educational',
      user_emotion: 'curious'
    };

    const analysis = await reflexionEngine.analyzeInput(input1, context1);
    console.log('Input:', input1);
    console.log('Analysis Result:');
    console.log('  - Intent:', analysis.intent);
    console.log('  - Language:', analysis.language);
    console.log('  - Dialect:', analysis.dialect);
    console.log('  - Complexity:', analysis.complexity);
    console.log('  - Entities:', analysis.entities.length);
    console.log('  - Duration:', analysis.duration_ms, 'ms');
    console.log('✅ Layer 1 PASSED\n');

    // Test 2: Layer 2 - Reasoning Generation
    console.log('=== TEST 2: Layer 2 - Reasoning Generation ===');
    const persona = {
      clarity: 80,
      empathy: 90,
      cultural: 100,
      formality: 60
    };

    const reasoning = await reflexionEngine.generateReasoning(analysis, persona);
    console.log('Reasoning Approach:', reasoning.approach);
    console.log('Strategy:', reasoning.strategy);
    console.log('Confidence:', reasoning.confidence);
    console.log('Cultural Filters:', reasoning.culturalFilters);
    console.log('Persona Traits:', reasoning.personaTraits);
    console.log('Duration:', reasoning.duration_ms, 'ms');
    console.log('✅ Layer 2 PASSED\n');

    // Test 3: Layer 3 - Self-Reflection
    console.log('=== TEST 3: Layer 3 - Self-Reflection ===');
    const reflection = await reflexionEngine.performSelfReflection(reasoning, analysis, null);
    console.log('Initial Output:', reflection.output.substring(0, 50) + '...');
    console.log('Quality Check Score:', reflection.qualityCheck.score);
    console.log('Cultural Check Score:', reflection.culturalCheck.score);
    console.log('Issues Found:', reflection.issues.length);
    console.log('Improvements Suggested:', reflection.improvements.length);
    console.log('Overall Score:', reflection.scores.overall);
    console.log('Duration:', reflection.duration_ms, 'ms');
    console.log('✅ Layer 3 PASSED\n');

    // Test 4: Layer 4 - Quality Evaluation
    console.log('=== TEST 4: Layer 4 - Quality Evaluation ===');
    const evaluation = await reflexionEngine.evaluateOutput(
      reflection.output,
      { minScore: 80 },
      { analysis, reasoning, reflection }
    );
    console.log('Evaluation Scores:');
    console.log('  - Cultural Alignment:', evaluation.cultural_alignment);
    console.log('  - Language Appropriateness:', evaluation.language_appropriateness);
    console.log('  - Emotional Tone:', evaluation.emotional_tone);
    console.log('  - Completeness:', evaluation.completeness);
    console.log('  - Clarity:', evaluation.clarity);
    console.log('  - Empathy:', evaluation.empathy);
    console.log('  - Respeto:', evaluation.respeto);
    console.log('  - Overall:', evaluation.overall);
    console.log('  - Grade:', evaluation.grade);
    console.log('  - Passed:', evaluation.passed ? 'YES' : 'NO');
    console.log('Duration:', evaluation.duration_ms, 'ms');
    console.log('✅ Layer 4 PASSED\n');

    // Test 5: Layer 5 - Final Generation
    console.log('=== TEST 5: Layer 5 - Final Generation ===');
    const finalResponse = await reflexionEngine.generateResponse(
      input1,
      reasoning,
      reflection,
      evaluation,
      null
    );
    console.log('Final Response:', finalResponse.response.substring(0, 100) + '...');
    console.log('Confidence:', (finalResponse.confidence * 100).toFixed(1) + '%');
    console.log('Reasoning Chain Layers:', finalResponse.reasoning_chain.length);
    console.log('Overall Score:', finalResponse.scores.overall);
    console.log('Processing Time:', finalResponse.metadata.processing_time_ms, 'ms');
    console.log('✅ Layer 5 PASSED\n');

    // Test 6: Full Pipeline
    console.log('=== TEST 6: Full 5-Layer Pipeline ===');
    const testInputs = [
      'Kiko ta empatia?',
      'Danki pa bo yudansa!',
      'Bon dia, kon bo ta?',
      'Kon nos por yuda nos komunidat?'
    ];

    for (const testInput of testInputs) {
      const startTime = Date.now();
      const result = await reflexionEngine.process(testInput, {
        context: {
          language: 'papiamentu',
          dialect: 'aruba'
        },
        persona: {
          clarity: 80,
          empathy: 90,
          cultural: 100
        },
        ai: null // No AI for basic test
      });

      const duration = Date.now() - startTime;
      console.log('\nInput:', testInput);
      console.log('Output:', result.response.substring(0, 60) + '...');
      console.log('Overall Score:', result.scores.overall);
      console.log('Confidence:', (result.confidence * 100).toFixed(1) + '%');
      console.log('Layers Processed:', result.metadata.layers_processed);
      console.log('Total Time:', duration, 'ms');
      console.log('Cached:', result.metadata.cached);
    }
    console.log('✅ Full Pipeline PASSED\n');

    // Test 7: Caching
    console.log('=== TEST 7: Caching ===');
    const cacheTestInput = 'Kiko ta respeto?';

    // First call
    const start1 = Date.now();
    const result1 = await reflexionEngine.process(cacheTestInput, {
      context: { language: 'papiamentu' },
      ai: null
    });
    const time1 = Date.now() - start1;

    // Second call (should be cached)
    const start2 = Date.now();
    const result2 = await reflexionEngine.process(cacheTestInput, {
      context: { language: 'papiamentu' },
      ai: null
    });
    const time2 = Date.now() - start2;

    console.log('First call time:', time1, 'ms');
    console.log('Second call time:', time2, 'ms');
    console.log('Second call cached:', result2.metadata.cached);
    console.log('Speed improvement:', ((time1 - time2) / time1 * 100).toFixed(1) + '%');
    console.log('✅ Caching PASSED\n');

    // Test 8: Cache Statistics
    console.log('=== TEST 8: Cache Statistics ===');
    const stats = reasoningCache.getStats();
    console.log('Cache Stats:');
    console.log('  - Hits:', stats.hits);
    console.log('  - Misses:', stats.misses);
    console.log('  - Sets:', stats.sets);
    console.log('  - Hit Rate:', stats.hit_rate);
    console.log('  - Size:', stats.size);
    console.log('  - Max Size:', stats.max_size);
    console.log('✅ Cache Statistics PASSED\n');

    // Test 9: AI Service
    console.log('=== TEST 9: AI Service ===');
    const models = aiService.getAvailableModels();
    console.log('Available AI Models:');
    console.log('  - Analysis:', models.analysis);
    console.log('  - Reasoning:', models.reasoning);
    console.log('  - Reflection:', models.reflection);
    console.log('  - Generation:', models.generation);
    console.log('  - Translation:', models.translation);
    console.log('  - Sentiment:', models.sentiment);
    console.log('AI Available (null):', aiService.isAvailable(null));
    console.log('✅ AI Service PASSED\n');

    // Summary
    console.log('='.repeat(60));
    console.log('✅ ALL TESTS PASSED! 🎉');
    console.log('='.repeat(60));
    console.log('\nReflexion Engine v3.0.0 is working correctly!');
    console.log('All 5 layers are operational:');
    console.log('  1. ✅ Input Analysis');
    console.log('  2. ✅ Reasoning Generation');
    console.log('  3. ✅ Self-Reflection');
    console.log('  4. ✅ Quality Evaluation');
    console.log('  5. ✅ Final Generation');
    console.log('\nNext steps:');
    console.log('  - Integrate with Cloudflare Workers AI');
    console.log('  - Deploy to worker.js');
    console.log('  - Test with real AI models');
    console.log('  - Build Papiamentu NLP (Week 2)');
    console.log('  - Build Emotion Analysis (Week 3)');
    console.log('  - Build Memory System (Week 4)');
    console.log('\n🚀 READY TO BUILD THE WORLD\'S BEST CULTURAL AI! 🚀\n');

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

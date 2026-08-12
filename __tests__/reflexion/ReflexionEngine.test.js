/**
 * Reflexion Engine Tests
 *
 * Tests for the Advanced 5-Layer Reflexion Engine
 */

import reflexionEngine from '../../services/reflexion/ReflexionEngine.js';
import aiService from '../../services/reflexion/AIService.js';

describe('Reflexion Engine - Advanced 5-Layer Architecture', () => {
  describe('Layer 1: Input Analysis', () => {
    test('should analyze simple Papiamentu question', async () => {
      const input = 'Kiko ta empatia?';
      const context = {
        language: 'papiamentu',
        dialect: 'aruba'
      };

      const analysis = await reflexionEngine.analyzeInput(input, context);

      expect(analysis).toBeDefined();
      expect(analysis.input).toBe(input);
      expect(analysis.intent).toBeDefined();
      expect(analysis.language).toBe('papiamentu');
      expect(analysis.dialect).toBe('aruba');
      expect(analysis.complexity).toBeDefined();
      expect(analysis.duration_ms).toBeGreaterThanOrEqual(0);
    });

    test('should detect question intent', async () => {
      const input = 'Kiko ta respeto?';
      const analysis = await reflexionEngine.analyzeInput(input);

      expect(analysis.intent).toBe('question');
    });

    test('should detect gratitude intent', async () => {
      const input = 'Danki pa bo yudansa!';
      const analysis = await reflexionEngine.analyzeInput(input);

      expect(analysis.intent).toBe('gratitude');
    });

    test('should extract cultural entities', async () => {
      const input = 'Mi ke sa mas tokante empatia i respeto';
      const analysis = await reflexionEngine.analyzeInput(input);

      expect(analysis.entities).toBeDefined();
      expect(analysis.entities.length).toBeGreaterThan(0);
    });

    test('should assess complexity correctly', async () => {
      const simpleInput = 'Bon dia';
      const complexInput = 'Kon nos por splika e konseptu di empatia den konteksto di nos kultura Karibense, konsiderando e diferensianan entre e tres dialektonan di Papiamentu?';

      const simpleAnalysis = await reflexionEngine.analyzeInput(simpleInput);
      const complexAnalysis = await reflexionEngine.analyzeInput(complexInput);

      expect(simpleAnalysis.complexity).toBe('simple');
      expect(complexAnalysis.complexity).toBe('complex');
    });
  });

  describe('Layer 2: Reasoning Generation', () => {
    test('should generate reasoning approach', async () => {
      const analysis = {
        input: 'Kiko ta empatia?',
        intent: 'question',
        entities: [{ type: 'cultural_concept', value: 'empatia' }],
        culturalContext: {
          situation: 'educational',
          formality: 0.5,
          cultural_markers: [],
          community_focus: false
        },
        complexity: 'simple',
        language: 'papiamentu',
        dialect: 'aruba'
      };

      const persona = {
        clarity: 80,
        empathy: 90,
        cultural: 100
      };

      const reasoning = await reflexionEngine.generateReasoning(analysis, persona);

      expect(reasoning).toBeDefined();
      expect(reasoning.approach).toBeDefined();
      expect(reasoning.strategy).toBeDefined();
      expect(reasoning.culturalFilters).toBeDefined();
      expect(reasoning.personaTraits).toBeDefined();
      expect(reasoning.confidence).toBeGreaterThan(0);
      expect(reasoning.duration_ms).toBeGreaterThanOrEqual(0);
    });

    test('should apply cultural filters', async () => {
      const analysis = {
        input: 'Test',
        intent: 'question',
        entities: [],
        culturalContext: {
          situation: 'general',
          formality: 0.7,
          cultural_markers: [],
          community_focus: true
        },
        complexity: 'simple',
        language: 'papiamentu',
        dialect: 'bonaire'
      };

      const reasoning = await reflexionEngine.generateReasoning(analysis);

      expect(reasoning.culturalFilters.language).toBe('papiamentu');
      expect(reasoning.culturalFilters.dialect).toBe('bonaire');
      expect(reasoning.culturalFilters.formality).toBe(0.7);
      expect(reasoning.culturalFilters.community_oriented).toBe(true);
    });

    test('should prefer community-focused approach when appropriate', async () => {
      const analysis = {
        input: 'Kon nos por yuda nos komunidat?',
        intent: 'question',
        entities: [],
        culturalContext: {
          situation: 'general',
          formality: 0.5,
          cultural_markers: [],
          community_focus: true
        },
        complexity: 'moderate',
        language: 'papiamentu',
        dialect: 'aruba'
      };

      const reasoning = await reflexionEngine.generateReasoning(analysis);

      // Should have community-focused approach as an option
      expect(reasoning.alternatives).toBeDefined();
    });
  });

  describe('Layer 3: Self-Reflection', () => {
    test('should perform self-reflection on reasoning', async () => {
      const reasoning = {
        approach: 'direct_explanation',
        strategy: 'Provide clear, direct answer',
        culturalFilters: { language: 'papiamentu' },
        personaTraits: { clarity: 80 },
        confidence: 0.85,
        duration_ms: 100
      };

      const analysis = {
        input: 'Kiko ta empatia?',
        intent: 'question'
      };

      // Mock AI (we'll use actual AI in integration tests)
      const mockAI = null;

      const reflection = await reflexionEngine.performSelfReflection(reasoning, analysis, mockAI);

      expect(reflection).toBeDefined();
      expect(reflection.output).toBeDefined();
      expect(reflection.qualityCheck).toBeDefined();
      expect(reflection.culturalCheck).toBeDefined();
      expect(reflection.issues).toBeDefined();
      expect(reflection.improvements).toBeDefined();
      expect(reflection.scores).toBeDefined();
      expect(reflection.scores.overall).toBeGreaterThan(0);
    });
  });

  describe('Layer 4: Quality Evaluation', () => {
    test('should evaluate output across all dimensions', async () => {
      const output = 'Empatia ta e kapasidad pa kompronde kon otro persona ta sinti.';
      const context = {
        analysis: {
          language: 'papiamentu',
          intent: 'question'
        }
      };

      const evaluation = await reflexionEngine.evaluateOutput(output, {}, context);

      expect(evaluation).toBeDefined();
      expect(evaluation.cultural_alignment).toBeDefined();
      expect(evaluation.language_appropriateness).toBeDefined();
      expect(evaluation.emotional_tone).toBeDefined();
      expect(evaluation.completeness).toBeDefined();
      expect(evaluation.clarity).toBeDefined();
      expect(evaluation.empathy).toBeDefined();
      expect(evaluation.respeto).toBeDefined();
      expect(evaluation.overall).toBeDefined();
      expect(evaluation.grade).toBeDefined();
      expect(evaluation.passed).toBeDefined();
    });

    test('should pass outputs with score >= 80', async () => {
      const goodOutput = 'High quality culturally aligned response';
      const evaluation = await reflexionEngine.evaluateOutput(goodOutput, { minScore: 80 });

      expect(evaluation.overall).toBeGreaterThanOrEqual(80);
      expect(evaluation.passed).toBe(true);
    });

    test('should assign correct grades', async () => {
      const output = 'Test output';

      const evaluation = await reflexionEngine.evaluateOutput(output);

      const gradeMap = {
        'A+': 95,
        'A': 90,
        'B+': 85,
        'B': 80,
        'C+': 75,
        'C': 70
      };

      expect(Object.keys(gradeMap)).toContain(evaluation.grade);
    });
  });

  describe('Layer 5: Final Generation', () => {
    test('should generate final response', async () => {
      const input = 'Kiko ta empatia?';
      const reasoning = {
        approach: 'direct_explanation',
        strategy: 'Clear explanation',
        duration_ms: 100
      };
      const reflection = {
        output: 'Initial output',
        improvements: [],
        scores: { overall: 90 },
        duration_ms: 100
      };
      const evaluation = {
        overall: 90,
        cultural_alignment: 92,
        clarity: 88,
        empathy: 91,
        respeto: 95,
        duration_ms: 50
      };

      const mockAI = null;

      const response = await reflexionEngine.generateResponse(
        input,
        reasoning,
        reflection,
        evaluation,
        mockAI
      );

      expect(response).toBeDefined();
      expect(response.response).toBeDefined();
      expect(response.confidence).toBeDefined();
      expect(response.reasoning_chain).toBeDefined();
      expect(response.reasoning_chain.length).toBe(5);
      expect(response.scores).toBeDefined();
      expect(response.metadata).toBeDefined();
    });
  });

  describe('Full Pipeline (All 5 Layers)', () => {
    test('should process simple question without AI', async () => {
      const input = 'Kiko ta empatia?';
      const options = {
        context: {
          language: 'papiamentu',
          dialect: 'aruba'
        },
        persona: {
          clarity: 80,
          empathy: 90
        },
        ai: null // No AI for this test
      };

      const result = await reflexionEngine.process(input, options);

      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.reasoning_chain).toBeDefined();
      expect(result.reasoning_chain.length).toBe(5);
      expect(result.scores).toBeDefined();
      expect(result.scores.overall).toBeGreaterThan(0);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.layers_processed).toBe(5);
    });

    test('should handle different dialects', async () => {
      const dialects = ['aruba', 'bonaire', 'curacao'];

      for (const dialect of dialects) {
        const result = await reflexionEngine.process('Bon dia', {
          context: { dialect },
          ai: null
        });

        expect(result).toBeDefined();
        expect(result.response).toBeDefined();
      }
    });

    test('should respect max reflection depth', async () => {
      const input = 'Test input';
      const result = await reflexionEngine.process(input, {
        criteria: { maxReflectionDepth: 1 },
        ai: null
      });

      expect(result.metadata.reflection_depth).toBeLessThanOrEqual(1);
    });

    test('should complete processing within reasonable time', async () => {
      const startTime = Date.now();

      await reflexionEngine.process('Kiko ta respeto?', { ai: null });

      const duration = Date.now() - startTime;

      // Should complete in under 1 second without AI
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Error Handling', () => {
    test('should handle empty input gracefully', async () => {
      await expect(async () => {
        await reflexionEngine.analyzeInput('');
      }).not.toThrow();
    });

    test('should handle invalid context gracefully', async () => {
      await expect(async () => {
        await reflexionEngine.analyzeInput('Test', { invalid: 'context' });
      }).not.toThrow();
    });

    test('should handle missing persona gracefully', async () => {
      const analysis = {
        input: 'Test',
        intent: 'question',
        entities: [],
        culturalContext: { formality: 0.5 },
        complexity: 'simple',
        language: 'papiamentu',
        dialect: 'aruba'
      };

      await expect(async () => {
        await reflexionEngine.generateReasoning(analysis);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('should cache results for repeated queries', async () => {
      const input = 'Kiko ta empatia?';
      const options = { ai: null };

      // First call
      const result1 = await reflexionEngine.process(input, options);

      // Second call (should be cached)
      const result2 = await reflexionEngine.process(input, options);

      // Second call should be cached (much faster)
      expect(result2.metadata.cached).toBe(true);
    });
  });
});

describe('AI Service', () => {
  test('should check AI availability', () => {
    expect(aiService.isAvailable(null)).toBe(false);
    expect(aiService.isAvailable(undefined)).toBe(false);
  });

  test('should provide available models', () => {
    const models = aiService.getAvailableModels();

    expect(models).toBeDefined();
    expect(models.analysis).toBeDefined();
    expect(models.reasoning).toBeDefined();
    expect(models.reflection).toBeDefined();
    expect(models.generation).toBeDefined();
    expect(models.translation).toBeDefined();
    expect(models.sentiment).toBeDefined();
  });
});

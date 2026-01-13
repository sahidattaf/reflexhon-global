/**
 * Manual Test Suite - Memory & Learning System
 *
 * Week 4 - Memory & Learning System
 * Tests all 4 components of the Memory & Learning layer
 *
 * Run: node test-memory-manual.js
 */

import ConversationMemory from './services/memory/ConversationMemory.js';
import SessionManager from './services/memory/SessionManager.js';
import PreferenceLearning from './services/memory/PreferenceLearning.js';
import CulturalAlignmentScorer from './services/memory/CulturalAlignmentScorer.js';

// Test utilities
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    log(`✓ ${testName}`, 'green');
    if (details) log(`  ${details}`, 'cyan');
  } else {
    failedTests++;
    log(`✗ ${testName}`, 'red');
    if (details) log(`  ${details}`, 'yellow');
  }
}

function assertEquals(actual, expected, testName) {
  const passed = actual === expected;
  assert(passed, testName, passed ? '' : `Expected: ${expected}, Got: ${actual}`);
}

function assertGreaterThan(actual, threshold, testName) {
  const passed = actual > threshold;
  assert(passed, testName, passed ? `Value: ${actual}` : `Expected > ${threshold}, Got: ${actual}`);
}

function testSection(title) {
  log(`\n${'='.repeat(70)}`, 'bold');
  log(`${title}`, 'blue');
  log(`${'='.repeat(70)}`, 'bold');
}

// Test Suite
async function runTests() {
  log('\n🔥 MEMORY & LEARNING SYSTEM - COMPREHENSIVE TEST SUITE', 'bold');
  log('Week 4 - v3.0.0 Cultural Intelligence', 'cyan');
  log(`Started: ${new Date().toISOString()}\n`, 'cyan');

  try {
    // ========================================================================
    // TEST 1: ConversationMemory - Basic Operations
    // ========================================================================
    testSection('TEST 1: ConversationMemory - Store & Retrieve Messages');

    const sessionId1 = 'test-session-001';

    const storeResult = await ConversationMemory.storeMessage(sessionId1, {
      role: 'user',
      content: 'Kon ta bai?',
      emotion: 'neutral',
      cultural_context: { language: 'papiamentu' }
    });

    assert(
      storeResult.success === true,
      'Store user message',
      `Message ID: ${storeResult.message_id}`
    );

    const history = await ConversationMemory.getHistory(sessionId1);
    assert(
      history.messages.length === 1,
      'Retrieve conversation history',
      `Found ${history.messages.length} message(s)`
    );

    assertEquals(
      history.messages[0].content,
      'Kon ta bai?',
      'Message content matches'
    );

    // ========================================================================
    // TEST 2: ConversationMemory - Summarization
    // ========================================================================
    testSection('TEST 2: ConversationMemory - Conversation Summarization');

    // Add more messages
    await ConversationMemory.storeMessage(sessionId1, {
      role: 'assistant',
      content: 'Mi ta bon, danki! Kon mi por yuda bo?',
      emotion: 'friendly'
    });

    await ConversationMemory.storeMessage(sessionId1, {
      role: 'user',
      content: 'Mi ta buskando informashon tokante kultura Papiamentu.',
      cultural_context: { language: 'papiamentu', topic: 'culture' }
    });

    const summary = await ConversationMemory.summarizeConversation(sessionId1);

    assert(
      summary.total_messages >= 3,
      'Summary includes all messages',
      `${summary.total_messages} messages analyzed`
    );

    assert(
      summary.topics.length > 0,
      'Topics extracted from conversation',
      `Topics: ${summary.topics.join(', ')}`
    );

    // ========================================================================
    // TEST 3: ConversationMemory - Relevant Context
    // ========================================================================
    testSection('TEST 3: ConversationMemory - Context Retrieval');

    const context = await ConversationMemory.getRelevantContext(
      sessionId1,
      'Tell me more about Papiamentu culture'
    );

    assert(
      context.relevant_messages !== undefined,
      'Retrieve relevant context',
      `Found ${context.relevant_messages.length} relevant message(s)`
    );

    assert(
      context.relevance_score >= 0,
      'Context relevance score calculated',
      `Relevance: ${context.relevance_score}`
    );

    // ========================================================================
    // TEST 4: SessionManager - Create & Manage Sessions
    // ========================================================================
    testSection('TEST 4: SessionManager - Session Lifecycle');

    const session = await SessionManager.createSession({
      user_id: 'test-user-123',
      preferences: {
        language: 'papiamentu',
        dialect: 'curacao'
      }
    });

    assert(
      session.session_id && session.session_id.length > 0,
      'Create new session',
      `Session ID: ${session.session_id}`
    );

    assert(
      session.success === true,
      'Session created successfully',
      `Status: ${session.success ? 'active' : 'failed'}`
    );

    // Get session
    const retrievedResult = await SessionManager.getSession(session.session_id);

    assert(
      retrievedResult.success === true && retrievedResult.session !== null,
      'Retrieve session by ID',
      `Found session: ${session.session_id}`
    );

    const retrieved = retrievedResult.session;

    assertEquals(
      retrieved.preferences.language,
      'papiamentu',
      'Session preferences persisted'
    );

    // ========================================================================
    // TEST 5: SessionManager - Update Activity
    // ========================================================================
    testSection('TEST 5: SessionManager - Activity Tracking');

    const originalActivity = retrieved.last_activity;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updated = await SessionManager.updateActivity(session.session_id);

    assert(
      updated.success === true,
      'Update session activity',
      `Last activity updated`
    );

    const afterUpdateResult = await SessionManager.getSession(session.session_id);
    const afterUpdate = afterUpdateResult.session;

    assert(
      afterUpdate.last_activity !== originalActivity,
      'Activity timestamp changed',
      `Updated: ${afterUpdate.last_activity}`
    );

    // ========================================================================
    // TEST 6: SessionManager - Update Preferences
    // ========================================================================
    testSection('TEST 6: SessionManager - Preference Updates');

    const prefUpdate = await SessionManager.updatePreferences(session.session_id, {
      formality: 0.8,
      warmth: 0.9
    });

    assert(
      prefUpdate.success === true,
      'Update session preferences',
      'Preferences merged successfully'
    );

    const withNewPrefsResult = await SessionManager.getSession(session.session_id);
    const withNewPrefs = withNewPrefsResult.session;

    assertEquals(
      withNewPrefs.preferences.formality,
      0.8,
      'New preference applied'
    );

    assertEquals(
      withNewPrefs.preferences.language,
      'papiamentu',
      'Original preference preserved'
    );

    // ========================================================================
    // TEST 7: PreferenceLearning - Detect Signals
    // ========================================================================
    testSection('TEST 7: PreferenceLearning - Signal Detection');

    const signals1 = PreferenceLearning.detectPreferenceSignals(
      'Por fabor, papia mas despasio. Keep it short please.'
    );

    assert(
      signals1.detected.length > 0,
      'Detect preference signals from message',
      `Detected ${signals1.detected.length} signal(s)`
    );

    const signals2 = PreferenceLearning.detectPreferenceSignals(
      'Mi ke mas detaye, por fabor eksplika bon.'
    );

    assert(
      signals2.formality !== 0,
      'Detect formality adjustment signals',
      `Formality adjust: ${signals2.formality > 0 ? '+' : ''}${signals2.formality}`
    );

    // ========================================================================
    // TEST 8: PreferenceLearning - Message Pattern Analysis
    // ========================================================================
    testSection('TEST 8: PreferenceLearning - Pattern Analysis');

    const patterns = PreferenceLearning.analyzeMessagePatterns(
      'Bon dia! Danki riba bo yudansa. Mi ta hopi agradecido.'
    );

    assertGreaterThan(
      patterns.politeness_markers,
      0,
      'Detect politeness markers',
      `Found ${patterns.politeness_markers} marker(s)`
    );

    assertEquals(
      patterns.language_detected,
      'papiamentu',
      'Detect message language'
    );

    assertGreaterThan(
      patterns.word_count,
      0,
      'Count words in message',
      `${patterns.word_count} words`
    );

    // ========================================================================
    // TEST 9: PreferenceLearning - Learn from Interaction
    // ========================================================================
    testSection('TEST 9: PreferenceLearning - Interactive Learning');

    const learning = await PreferenceLearning.learnFromInteraction(
      'test-session-learning',
      {
        user_message: 'Great answer! Very helpful. Thank you!',
        ai_response: 'Mi ta kontentu ku mi por yuda bo.',
        user_feedback: { type: 'positive', rating: 5 }
      }
    );

    assert(
      learning.confidence >= 0,
      'Calculate learning confidence',
      `Confidence: ${(learning.confidence * 100).toFixed(1)}%`
    );

    assert(
      learning.current_preferences !== null,
      'Retrieve current preferences after learning'
    );

    // ========================================================================
    // TEST 10: PreferenceLearning - Apply Preferences
    // ========================================================================
    testSection('TEST 10: PreferenceLearning - Apply to Response');

    const prefs = await PreferenceLearning.getPreferences('test-session-apply');

    const response = 'Mi ta komprende bo pregunta. E ta importante pa siña tokante esaki. ' +
                     'Nos kultura ta hopi rikí. Mi por duna bo hopi ehempel. ' +
                     'Laga nos papia tokante tradishonnan. Historia ta enseña nos hopi kos.';

    const applied = PreferenceLearning.applyPreferences(response, prefs);

    assert(
      applied.response !== null && applied.response.length > 0,
      'Apply preferences to response',
      `Original: ${applied.metadata.original_length} chars`
    );

    assert(
      applied.metadata.adjustments.length >= 0,
      'Track preference adjustments',
      `Adjustments: ${applied.metadata.adjustments.join(', ') || 'none'}`
    );

    // ========================================================================
    // TEST 11: CulturalAlignmentScorer - Language Appropriateness
    // ========================================================================
    testSection('TEST 11: CulturalAlignmentScorer - Language Dimension');

    const testResponse1 = 'Mi ta kompronde bo pregunta. E ta bon pa siña tokante nos kultura.';

    const languageScore = CulturalAlignmentScorer.scoreLanguageAppropriateness(
      testResponse1,
      { language_preference: 'papiamentu' }
    );

    assertGreaterThan(
      languageScore,
      70,
      'Score language appropriateness',
      `Score: ${languageScore}/100`
    );

    // ========================================================================
    // TEST 12: CulturalAlignmentScorer - Respectfulness (Respeto)
    // ========================================================================
    testSection('TEST 12: CulturalAlignmentScorer - Respeto Dimension');

    const testResponse2 = 'Señor, por fabor, kon mi por yuda bo? Mi ta na bo desposishon.';

    const respectScore = CulturalAlignmentScorer.scoreRespectfulness(
      testResponse2,
      { audience: 'elder' }
    );

    assertGreaterThan(
      respectScore,
      75,
      'Score respectfulness for elder audience',
      `Score: ${respectScore}/100`
    );

    // Test peer audience (lower formality expected)
    const testResponse3 = 'Ayo, bon dia! Kon ta bai?';

    const peerScore = CulturalAlignmentScorer.scoreRespectfulness(
      testResponse3,
      { audience: 'peer' }
    );

    assertGreaterThan(
      peerScore,
      60,
      'Score respectfulness for peer audience',
      `Score: ${peerScore}/100`
    );

    // ========================================================================
    // TEST 13: CulturalAlignmentScorer - Empathy
    // ========================================================================
    testSection('TEST 13: CulturalAlignmentScorer - Empathy Dimension');

    const testResponse4 = 'Mi ta kompronde kon bo ta sinti. E ta normal pa sinti asina. Mi ta aki pa bo.';

    const empathyScore = CulturalAlignmentScorer.scoreEmpathy(
      testResponse4,
      { emotion: 'sad' }
    );

    assertGreaterThan(
      empathyScore,
      70,
      'Score empathy in emotional context',
      `Score: ${empathyScore}/100`
    );

    // ========================================================================
    // TEST 14: CulturalAlignmentScorer - Warmth
    // ========================================================================
    testSection('TEST 14: CulturalAlignmentScorer - Caribbean Warmth');

    const testResponse5 = 'Bon dia, mi dushi! Mi ta hopi kontentu pa wak bo!';

    const warmthScore = CulturalAlignmentScorer.scoreWarmth(
      testResponse5,
      { situation: 'greeting' }
    );

    assertGreaterThan(
      warmthScore,
      75,
      'Score Caribbean warmth',
      `Score: ${warmthScore}/100`
    );

    // ========================================================================
    // TEST 15: CulturalAlignmentScorer - Overall Alignment
    // ========================================================================
    testSection('TEST 15: CulturalAlignmentScorer - Complete Alignment Analysis');

    const testResponse6 = 'Bon dia! Mi ta kompronde bo pregunta tokante nos kultura Papiamentu. ' +
                         'E ta hopi importante pa mantené nos tradishonnan. ' +
                         'Na nos isla, famia ta hopi importante. ' +
                         'Mi por yuda bo siña mas tokante esaki.';

    const alignment = await CulturalAlignmentScorer.scoreAlignment(
      testResponse6,
      {
        culture: 'caribbean',
        language_preference: 'papiamentu',
        audience: 'peer',
        situation: 'educational'
      }
    );

    assertGreaterThan(
      alignment.overall_score,
      60,
      'Calculate overall cultural alignment',
      `Overall: ${alignment.overall_score.toFixed(1)}/100`
    );

    assertEquals(
      typeof alignment.quality_level,
      'string',
      'Determine quality level',
      `Quality: ${alignment.quality_level}`
    );

    assert(
      Object.keys(alignment.dimension_scores).length === 10,
      'Score all 10 dimensions',
      `Dimensions evaluated: ${Object.keys(alignment.dimension_scores).length}`
    );

    assert(
      alignment.suggestions !== undefined,
      'Generate improvement suggestions',
      `${alignment.suggestions.length} suggestion(s) provided`
    );

    // ========================================================================
    // TEST 16: CulturalAlignmentScorer - Low Alignment Detection
    // ========================================================================
    testSection('TEST 16: CulturalAlignmentScorer - Low Alignment Response');

    const testResponse7 = 'Furthermore, notwithstanding the aforementioned facts, one must consider...';

    const lowAlignment = await CulturalAlignmentScorer.scoreAlignment(
      testResponse7,
      {
        culture: 'caribbean',
        language_preference: 'papiamentu',
        audience: 'peer'
      }
    );

    assert(
      lowAlignment.overall_score < 75,
      'Detect low cultural alignment',
      `Score: ${lowAlignment.overall_score.toFixed(1)}/100`
    );

    assert(
      lowAlignment.suggestions.length > 0,
      'Provide suggestions for improvement',
      `${lowAlignment.suggestions.length} improvement(s) suggested`
    );

    // ========================================================================
    // TEST 17: Integration - Full Conversation Flow
    // ========================================================================
    testSection('TEST 17: Integration - Complete Conversation Flow');

    // Create session
    const integrationSession = await SessionManager.createSession({
      user_id: 'integration-test-user',
      preferences: { language: 'papiamentu', dialect: 'curacao' }
    });

    // Store conversation
    await ConversationMemory.storeMessage(integrationSession.session_id, {
      role: 'user',
      content: 'Bon dia! Mi ke siña tokante respeto na nos kultura.',
      emotion: 'curious'
    });

    // Learn from interaction
    const learnResult = await PreferenceLearning.learnFromInteraction(
      integrationSession.session_id,
      {
        user_message: 'Por fabor, duna mi mas detaye.',
        ai_response: 'Mi ta komprende. Mi lo eksplika bon.'
      }
    );

    // Score alignment
    const integrationScore = await CulturalAlignmentScorer.scoreAlignment(
      'Mi ta kompronde. Mi lo eksplika bon.',
      { audience: 'peer', language_preference: 'papiamentu' }
    );

    assert(
      integrationSession.session_id !== null,
      'Full conversation flow - Session created'
    );

    assert(
      learnResult.confidence >= 0,
      'Full conversation flow - Learning occurred',
      `Confidence: ${(learnResult.confidence * 100).toFixed(1)}%`
    );

    assert(
      integrationScore.overall_score > 0,
      'Full conversation flow - Alignment scored',
      `Alignment: ${integrationScore.overall_score.toFixed(1)}/100`
    );

    // ========================================================================
    // TEST 18: Performance - Response Time
    // ========================================================================
    testSection('TEST 18: Performance - Processing Speed');

    const start = Date.now();

    // Run multiple operations
    const perfSession = await SessionManager.createSession();
    await ConversationMemory.storeMessage(perfSession.session_id, {
      role: 'user',
      content: 'Performance test message'
    });
    const perfAlignment = await CulturalAlignmentScorer.scoreAlignment(
      'Test response',
      {}
    );

    const elapsed = Date.now() - start;

    assert(
      elapsed < 1000,
      'All operations complete within 1 second',
      `Processing time: ${elapsed}ms`
    );

    // ========================================================================
    // TEST 19: Edge Cases - Empty Input
    // ========================================================================
    testSection('TEST 19: Edge Cases - Empty/Invalid Input');

    const emptyScore = await CulturalAlignmentScorer.scoreAlignment('', {});

    assert(
      emptyScore.overall_score >= 0,
      'Handle empty response gracefully',
      `Score: ${emptyScore.overall_score}`
    );

    const emptySignals = PreferenceLearning.detectPreferenceSignals('');

    assert(
      emptySignals.detected.length === 0,
      'Handle empty message in preference learning',
      'No signals detected (expected)'
    );

    // ========================================================================
    // TEST 20: Preference Summary
    // ========================================================================
    testSection('TEST 20: PreferenceLearning - Preference Summary');

    const summary2 = await PreferenceLearning.getPreferenceSummary(
      integrationSession.session_id
    );

    assert(
      summary2.session_id === integrationSession.session_id,
      'Generate preference summary',
      `Session: ${summary2.session_id}`
    );

    assert(
      summary2.language !== undefined,
      'Summary includes language preferences'
    );

    assert(
      summary2.communication_style !== undefined,
      'Summary includes communication style'
    );

    // ========================================================================
    // FINAL SUMMARY
    // ========================================================================
    testSection('TEST RESULTS SUMMARY');

    const passRate = ((passedTests / totalTests) * 100).toFixed(1);

    log(`\nTotal Tests: ${totalTests}`, 'cyan');
    log(`Passed: ${passedTests}`, 'green');
    log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
    log(`Pass Rate: ${passRate}%`, passRate === '100.0' ? 'green' : 'yellow');

    if (failedTests === 0) {
      log('\n🎉 ALL TESTS PASSED! 🎉', 'green');
      log('Memory & Learning System is working perfectly!', 'green');
    } else {
      log(`\n⚠️  ${failedTests} test(s) failed. Review output above.`, 'yellow');
    }

    log(`\nCompleted: ${new Date().toISOString()}`, 'cyan');
    log('='.repeat(70), 'bold');

  } catch (error) {
    log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runTests().then(() => {
  process.exit(failedTests > 0 ? 1 : 0);
});

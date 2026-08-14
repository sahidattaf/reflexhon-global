import worker, { parseJsonBody } from '../worker-v3.js';

const context = { waitUntil: () => {} };

describe('Worker request validation', () => {
  test('health reports operational metadata without unsupported capability claims', async () => {
    const response = await worker.fetch(
      new Request('https://example.test/health'),
      { NODE_ENV: 'production' },
      context
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: 'ok',
      version: '3.0.0',
      runtime: 'Cloudflare Workers'
    });
    expect(body).not.toHaveProperty('features');
    expect(body).not.toHaveProperty('uptime');
  });

  test('API information distinguishes implemented routes from verified claims', async () => {
    const response = await worker.fetch(
      new Request('https://example.test/api'),
      { NODE_ENV: 'production' },
      context
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.version).toBe('3.0.0');
    expect(body.verification_note).toMatch(/implemented routes/i);
    expect(body.endpoints.reflexion).toBe('POST /api/v1/reflexion');
    expect(body).not.toHaveProperty('status');
    expect(body).not.toHaveProperty('deployed');
    expect(body).not.toHaveProperty('tagline');
  });

  test('accepts a JSON object within the payload limit', async () => {
    const request = new Request('https://example.test/api/v1/reflexion', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: 'Bon dia' })
    });

    await expect(parseJsonBody(request)).resolves.toEqual({ input: 'Bon dia' });
  });

  test('rejects a non-JSON content type', async () => {
    const request = new Request('https://example.test/api/v1/reflexion', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'Bon dia'
    });

    await expect(parseJsonBody(request)).rejects.toMatchObject({ status: 415 });
  });

  test('rejects malformed JSON', async () => {
    const request = new Request('https://example.test/api/v1/reflexion', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{'
    });

    await expect(parseJsonBody(request)).rejects.toMatchObject({ status: 400 });
  });

  test('rejects JSON arrays', async () => {
    const request = new Request('https://example.test/api/v1/reflexion', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '[]'
    });

    await expect(parseJsonBody(request)).rejects.toMatchObject({ status: 400 });
  });

  test('rejects bodies larger than 16 KiB', async () => {
    const request = new Request('https://example.test/api/v1/reflexion', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: 'x'.repeat(17 * 1024) })
    });

    await expect(parseJsonBody(request)).rejects.toMatchObject({ status: 413 });
  });

  test('emotion endpoint returns 415 for non-JSON requests', async () => {
    const request = new Request('https://example.test/api/v1/emotion', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'Bon dia'
    });

    const response = await worker.fetch(request, { NODE_ENV: 'production' }, context);
    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: 'Content-Type must be application/json'
    });
  });

  test('reflexion endpoint rejects oversized text', async () => {
    const request = new Request('https://example.test/api/v1/reflexion', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: 'x'.repeat(4001) })
    });

    const response = await worker.fetch(request, { NODE_ENV: 'production' }, context);
    expect(response.status).toBe(413);
  });
});
